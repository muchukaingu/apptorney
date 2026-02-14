const { execFile } = require('child_process')
const path = require('path')

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
const DEFAULT_MAX_CANDIDATES = 5000

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
  return parsed
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

function embedQueryText(queryText, cb) {
  const pythonBin = process.env.EMBEDDING_PYTHON_BIN || 'python3'
  const modelName = process.env.EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2'
  const scriptPath = process.env.EMBEDDING_QUERY_SCRIPT ||
    path.resolve(__dirname, '../../../scripts/embed_text.py')

  execFile(
    pythonBin,
    [scriptPath, '--text', queryText, '--model-name', modelName],
    { maxBuffer: 10 * 1024 * 1024 },
    function (err, stdout, stderr) {
      if (err) {
        const message = stderr && stderr.trim()
          ? stderr.trim()
          : err.message
        cb(new Error('Failed to generate query embedding: ' + message))
        return
      }

      try {
        const vector = parseQueryVector(stdout.trim())
        cb(null, vector)
      } catch (parseErr) {
        cb(new Error('Query embedding output is invalid JSON array'))
      }
    }
  )
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

  const cursor = collection.find(match, { projection }).limit(maxCandidates)
  const top = []
  let scanned = 0
  let compared = 0

  cursor.forEach(
    function (doc) {
      scanned += 1
      const candidateVector = doc[embeddingField]
      const score = cosineSimilarity(queryVector, candidateVector)
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
      cb(null, {
        limit,
        scanned,
        compared,
        results
      })
    }
  )
}

module.exports = {
  MAX_LIMIT,
  sanitizeLimit,
  resolveQueryVector,
  searchCollection
}
