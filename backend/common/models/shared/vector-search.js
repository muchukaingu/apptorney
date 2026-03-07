const https = require('https')
const urlParser = require('url')

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
const DEFAULT_MAX_CANDIDATES = 600
const MAX_MAX_CANDIDATES = 2000
const DEFAULT_VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings'
const DEFAULT_VOYAGE_MODEL = 'voyage-law-2'
const DEFAULT_VOYAGE_INPUT_TYPE = 'query'
const DEFAULT_VOYAGE_TIMEOUT_MS = 60000
const DEFAULT_PROGRESS_EVERY = 250
const DEFAULT_MONGO_BATCH_SIZE = 100

function sanitizeLimit(limit) {
  const parsed = parseInt(limit, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT
  }
  return Math.min(parsed, MAX_LIMIT)
}

function sanitizeMaxCandidates(value) {
  const parsed = parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_CANDIDATES
  }
  return Math.min(parsed, MAX_MAX_CANDIDATES)
}

function parseQueryVector(input) {
  if (!input) {
    return null
  }

  const raw = typeof input === 'string' ? JSON.parse(input) : input
  if (!Array.isArray(raw)) {
    throw new Error('queryVector must be an array of numbers')
  }

  const vector = raw.map(Number)
  const hasInvalid = vector.some((value) => !Number.isFinite(value))
  if (hasInvalid || vector.length === 0) {
    throw new Error('queryVector must contain valid numbers')
  }

  return vector
}

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
        cb(new Error('Voyage request failed (' + res.statusCode + '): ' + body))
        return
      }
      try {
        cb(null, JSON.parse(body))
      } catch (err) {
        cb(new Error('Failed to parse Voyage response JSON'))
      }
    })
  })

  request.on('timeout', function () {
    request.destroy(new Error('Voyage request timed out'))
  })
  request.on('error', cb)
  request.write(data)
  request.end()
}

function embedQueryText(queryText, cb) {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    cb(new Error('Missing VOYAGE_API_KEY environment variable'))
    return
  }

  const modelName = process.env.VOYAGE_QUERY_EMBEDDING_MODEL ||
    process.env.VOYAGE_EMBEDDING_MODEL ||
    DEFAULT_VOYAGE_MODEL
  const inputType = process.env.VOYAGE_QUERY_INPUT_TYPE || DEFAULT_VOYAGE_INPUT_TYPE
  const apiUrl = process.env.VOYAGE_QUERY_API_URL || process.env.VOYAGE_API_URL || DEFAULT_VOYAGE_API_URL
  const timeoutMs = parseInt(process.env.VOYAGE_QUERY_TIMEOUT_MS || '', 10) || DEFAULT_VOYAGE_TIMEOUT_MS

  postJson(apiUrl, apiKey, {
    model: modelName,
    input: [queryText],
    input_type: inputType
  }, timeoutMs, function (err, data) {
    if (err) {
      cb(err)
      return
    }

    const embeddings = data && data.data
    if (!Array.isArray(embeddings) || embeddings.length < 1 || !Array.isArray(embeddings[0].embedding)) {
      cb(new Error('Voyage response missing embedding data'))
      return
    }

    try {
      const vector = parseQueryVector(embeddings[0].embedding)
      cb(null, vector)
    } catch (parseErr) {
      console.error('[voyage-embed] parseQueryVector failed:', parseErr.message)
      console.error('[voyage-embed] embedding type:', typeof embeddings[0].embedding, 'isArray:', Array.isArray(embeddings[0].embedding), 'length:', embeddings[0].embedding && embeddings[0].embedding.length)
      cb(new Error('Voyage embedding output is invalid: ' + parseErr.message))
    }
  })
}

function resolveQueryVector(payload, cb) {
  if (!payload) {
    cb(new Error('Request body is required'))
    return
  }

  try {
    const vector = parseQueryVector(payload.queryVector)
    if (vector) {
      cb(null, vector)
      return
    }
  } catch (err) {
    cb(err)
    return
  }

  if (!payload.queryText || typeof payload.queryText !== 'string' || payload.queryText.trim().length === 0) {
    cb(new Error('Provide either queryVector or queryText'))
    return
  }

  embedQueryText(payload.queryText.trim(), cb)
}

function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || a.length === 0) {
    return null
  }

  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i += 1) {
    const x = Number(a[i])
    const y = Number(b[i])
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return null
    }
    dot += x * y
    normA += x * x
    normB += y * y
  }

  if (normA === 0 || normB === 0) {
    return null
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function scoreCandidateVector(queryVector, candidateVector) {
  if (!Array.isArray(candidateVector)) {
    return null
  }

  if (candidateVector.length === 0) {
    return null
  }

  if (typeof candidateVector[0] === 'number') {
    return cosineSimilarity(queryVector, candidateVector)
  }

  if (Array.isArray(candidateVector[0])) {
    let best = null
    for (let i = 0; i < candidateVector.length; i += 1) {
      const score = cosineSimilarity(queryVector, candidateVector[i])
      if (score === null) {
        continue
      }
      if (best === null || score > best) {
        best = score
      }
    }
    return best
  }

  return null
}

function insertTopK(top, item, k) {
  if (top.length < k) {
    top.push(item)
    top.sort((a, b) => a.score - b.score)
    return
  }

  if (item.score <= top[0].score) {
    return
  }

  top[0] = item
  top.sort((a, b) => a.score - b.score)
}

function searchCollection(opts, cb) {
  const limit = sanitizeLimit(opts.limit)
  const maxCandidates = sanitizeMaxCandidates(opts.maxCandidates)
  const queryVector = opts.queryVector
  const embeddingField = opts.embeddingField
  const projection = opts.projection || {}
  const collection = opts.collection
  const match = Object.assign({}, opts.match || {}, { [embeddingField]: { $exists: true } })
  const mapResult = opts.mapResult || function (doc) { return doc }

  const logPrefix = opts.logPrefix || 'vector-search'
  const progressEveryRaw = parseInt(process.env.VECTOR_SEARCH_LOG_EVERY || '', 10)
  const progressEvery = Number.isFinite(progressEveryRaw) && progressEveryRaw > 0
    ? progressEveryRaw
    : DEFAULT_PROGRESS_EVERY
  const batchSizeRaw = parseInt(process.env.VECTOR_SEARCH_MONGO_BATCH_SIZE || '', 10)
  const batchSize = Number.isFinite(batchSizeRaw) && batchSizeRaw > 0
    ? batchSizeRaw
    : DEFAULT_MONGO_BATCH_SIZE

  const cursor = collection.find(match, { projection }).limit(maxCandidates).batchSize(batchSize)
  const top = []
  let scanned = 0
  let compared = 0
  const searchStartMs = Date.now()

  console.log('[' + logPrefix + '] start limit=' + limit + ' maxCandidates=' + maxCandidates + ' batchSize=' + batchSize)

  cursor.forEach(
    function (doc) {
      scanned += 1
      if (scanned % progressEvery === 0) {
        console.log('[' + logPrefix + '] scanned=' + scanned + ' compared=' + compared)
      }
      const candidateVector = doc[embeddingField]
      const score = scoreCandidateVector(queryVector, candidateVector)
      if (score === null) {
        return
      }
      compared += 1
      const mapped = mapResult(doc)
      insertTopK(top, Object.assign({ score }, mapped), limit)
    },
    function (err) {
      if (err) {
        cb(err)
        return
      }

      const results = top.sort((a, b) => b.score - a.score)
      console.log('[' + logPrefix + '] done scanned=' + scanned + ' compared=' + compared + ' elapsed_ms=' + (Date.now() - searchStartMs))
      cb(null, {
        limit,
        scanned,
        compared,
        results
      })
    }
  )
}

function searchCollectionAtlas(opts, cb) {
  var limit = sanitizeLimit(opts.limit)
  var queryVector = opts.queryVector
  var indexName = opts.indexName
  var chunkCollection = opts.chunkCollection
  var includeDeleted = opts.includeDeleted || false
  var logPrefix = opts.logPrefix || 'vector-search-atlas'
  var mapResult = opts.mapResult || function (doc) { return doc }

  var numCandidatesRaw = parseInt(process.env.ATLAS_VECTOR_NUM_CANDIDATES || '', 10)
  var numCandidates = Number.isFinite(numCandidatesRaw) && numCandidatesRaw > 0
    ? numCandidatesRaw
    : limit * 15

  // Pre-group limit: request more chunks than final limit since multiple
  // chunks may belong to the same parent document
  var preGroupLimit = Math.min(limit * 10, numCandidates)

  var filter = includeDeleted ? {} : { deleted: { $ne: true } }

  var pipeline = [
    {
      $vectorSearch: {
        index: indexName,
        path: 'embedding',
        queryVector: queryVector,
        numCandidates: numCandidates,
        limit: preGroupLimit,
        filter: filter
      }
    },
    {
      $addFields: {
        _vsScore: { $meta: 'vectorSearchScore' }
      }
    },
    {
      $sort: { _vsScore: -1 }
    },
    {
      $group: {
        _id: '$parentId',
        score: { $max: '$_vsScore' },
        name: { $first: '$name' },
        caseNumber: { $first: '$caseNumber' },
        summaryOfRuling: { $first: '$summaryOfRuling' },
        summaryOfFacts: { $first: '$summaryOfFacts' },
        citation: { $first: '$citation' },
        legislationName: { $first: '$legislationName' },
        legislationNumber: { $first: '$legislationNumber' },
        legislationNumbers: { $first: '$legislationNumbers' },
        preamble: { $first: '$preamble' },
        dateOfAssent: { $first: '$dateOfAssent' },
        year: { $first: '$year' }
      }
    },
    {
      $sort: { score: -1 }
    },
    {
      $limit: limit
    }
  ]

  var searchStartMs = Date.now()
  console.log('[' + logPrefix + '] start index=' + indexName + ' limit=' + limit + ' numCandidates=' + numCandidates)

  chunkCollection.aggregate(pipeline).toArray(function (err, docs) {
    if (err) {
      console.error('[' + logPrefix + '] error: ' + err.message)
      cb(err)
      return
    }

    var results = []
    for (var i = 0; i < docs.length; i += 1) {
      var doc = docs[i]
      var mapped = mapResult(doc)
      mapped.score = doc.score
      results.push(mapped)
    }

    var elapsedMs = Date.now() - searchStartMs
    console.log('[' + logPrefix + '] done results=' + results.length + ' elapsed_ms=' + elapsedMs)
    cb(null, {
      limit: limit,
      scanned: numCandidates,
      compared: docs.length,
      results: results
    })
  })
}

module.exports = {
  MAX_LIMIT,
  sanitizeLimit,
  resolveQueryVector,
  searchCollection,
  searchCollectionAtlas
}
