const https = require('https')
const urlParser = require('url')
const DEFAULT_OPENAI_TIMEOUT_MS = 120000

function postJson(targetUrl, apiKey, payload, timeoutMs, cb) {
    const data = JSON.stringify(payload)
    const parsed = urlParser.parse(targetUrl)
    const requestOptions = {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'Content-Length': Buffer.byteLength(data)
    },
    timeout: timeoutMs
  }

    const request = https.request(requestOptions, function (res) {
    let body = ''
    res.on('data', function (chunk) { body += chunk })
    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        cb(new Error('OpenAI request failed (' + res.statusCode + '): ' + body))
        return
      }
      try {
        cb(null, JSON.parse(body))
      } catch (err) {
        cb(new Error('Failed to parse OpenAI response JSON'))
      }
    })
  })

  request.on('timeout', function () {
    request.destroy(new Error('OpenAI request timed out'))
  })
  request.on('error', cb)
  request.write(data)
  request.end()
}

function createChatCompletion(opts, cb) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    cb(new Error('Missing OPENAI_API_KEY environment variable'))
    return
  }

  const model = opts.model || process.env.OPENAI_CHAT_MODEL || 'gpt-5.2'
  const payload = {
    model: model,
    temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.2,
    messages: opts.messages
  }
  if (typeof opts.maxTokens === 'number' && opts.maxTokens > 0) {
    payload.max_completion_tokens = opts.maxTokens
  }
  const timeoutMs = parseInt(process.env.OPENAI_TIMEOUT_MS || '', 10) || DEFAULT_OPENAI_TIMEOUT_MS

  postJson('https://api.openai.com/v1/chat/completions', apiKey, payload, timeoutMs, function (err, data) {
    if (err) {
      cb(err)
      return
    }

    const choice = data && data.choices && data.choices[0]
    const text = choice && choice.message && choice.message.content
    if (!text) {
      cb(new Error('OpenAI response did not include message content'))
      return
    }

    cb(null, {
      model: data.model || model,
      usage: data.usage || {},
      text: text
    })
  })
}

/**
 * Streaming chat completion using OpenAI's SSE streaming API.
 * Node 8 compatible — uses native https and line-by-line SSE parsing.
 *
 * @param {Object} opts - Same as createChatCompletion (model, temperature, messages, maxTokens)
 * @param {Object} handlers
 * @param {Function} handlers.onToken(text) - Called for each content delta
 * @param {Function} handlers.onDone({model, usage, text}) - Called when stream finishes
 * @param {Function} handlers.onError(err) - Called on error
 * @returns {Object} The http request (can be aborted with .destroy())
 */
function createStreamingChatCompletion(opts, handlers) {
  var apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    handlers.onError(new Error('Missing OPENAI_API_KEY environment variable'))
    return null
  }

  var model = opts.model || process.env.OPENAI_CHAT_MODEL || 'gpt-5.2'
  var payload = {
    model: model,
    temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.2,
    messages: opts.messages,
    stream: true,
    stream_options: { include_usage: true }
  }
  if (typeof opts.maxTokens === 'number' && opts.maxTokens > 0) {
    payload.max_completion_tokens = opts.maxTokens
  }

  var timeoutMs = parseInt(process.env.OPENAI_TIMEOUT_MS || '', 10) || DEFAULT_OPENAI_TIMEOUT_MS
  var data = JSON.stringify(payload)
  var parsed = urlParser.parse('https://api.openai.com/v1/chat/completions')

  var requestOptions = {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port,
    path: parsed.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'Content-Length': Buffer.byteLength(data)
    },
    timeout: timeoutMs
  }

  var fullText = ''
  var resolvedModel = model
  var usage = {}
  var finished = false

  function done(err) {
    if (finished) return
    finished = true
    if (err) {
      handlers.onError(err)
    } else {
      handlers.onDone({ model: resolvedModel, usage: usage, text: fullText })
    }
  }

  var request = https.request(requestOptions, function (res) {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      var errBody = ''
      res.on('data', function (chunk) { errBody += chunk })
      res.on('end', function () {
        done(new Error('OpenAI streaming request failed (' + res.statusCode + '): ' + errBody))
      })
      return
    }

    var buffer = ''

    res.on('data', function (chunk) {
      buffer += chunk.toString()

      // Process complete lines
      var lines = buffer.split('\n')
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || ''

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim()

        if (!line || line.indexOf('data: ') !== 0) {
          continue
        }

        var payload = line.slice(6) // Remove 'data: ' prefix

        if (payload === '[DONE]') {
          done(null)
          return
        }

        try {
          var parsed = JSON.parse(payload)

          // Capture model from first chunk
          if (parsed.model) {
            resolvedModel = parsed.model
          }

          // Capture usage from the final chunk (stream_options: include_usage)
          if (parsed.usage) {
            usage = parsed.usage
          }

          // Extract content delta
          var choices = parsed.choices
          if (choices && choices.length > 0) {
            var delta = choices[0].delta
            if (delta && typeof delta.content === 'string') {
              fullText += delta.content
              handlers.onToken(delta.content)
            }
          }
        } catch (parseErr) {
          // Skip malformed JSON lines
        }
      }
    })

    res.on('end', function () {
      // In case [DONE] was missed, finish gracefully
      done(null)
    })
  })

  request.on('timeout', function () {
    request.destroy()
    done(new Error('OpenAI streaming request timed out'))
  })

  request.on('error', function (err) {
    done(err)
  })

  request.write(data)
  request.end()

  return request
}

module.exports = {
  createChatCompletion,
  createStreamingChatCompletion
}
