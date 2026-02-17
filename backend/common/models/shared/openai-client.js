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

module.exports = {
  createChatCompletion
}
