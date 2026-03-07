#!/usr/bin/env node
'use strict'

/**
 * migrate-chunks.js
 *
 * Denormalizes chunked embeddings from case/legislation documents into
 * dedicated caseChunks/legislationChunks collections for Atlas $vectorSearch.
 *
 * Usage:
 *   node scripts/migrate-chunks.js --mongo-uri "mongodb+srv://..." --db-name apptorney
 */

var { MongoClient } = require('mongodb')

var DEFAULT_DB_NAME = 'apptorney'
var DEFAULT_BATCH_SIZE = 200

function parseArgs(argv) {
  var args = {
    mongoUri: '',
    dbName: DEFAULT_DB_NAME,
    batchSize: DEFAULT_BATCH_SIZE,
    collection: 'both',
    dryRun: false,
    fresh: false,
    indexOnly: false
  }
  for (var i = 2; i < argv.length; i += 1) {
    var arg = argv[i]
    if (arg === '--mongo-uri' && argv[i + 1]) { args.mongoUri = argv[++i] }
    else if (arg === '--db-name' && argv[i + 1]) { args.dbName = argv[++i] }
    else if (arg === '--batch-size' && argv[i + 1]) { args.batchSize = parseInt(argv[++i], 10) || DEFAULT_BATCH_SIZE }
    else if (arg === '--collection' && argv[i + 1]) { args.collection = argv[++i] }
    else if (arg === '--dry-run') { args.dryRun = true }
    else if (arg === '--fresh') { args.fresh = true }
    else if (arg === '--index-only') { args.indexOnly = true }
  }
  return args
}

async function migrateCollection(db, opts) {
  var sourceCollName = opts.sourceCollection
  var chunkCollName = opts.chunkCollection
  var embeddingField = opts.embeddingField
  var metadataFields = opts.metadataFields
  var dryRun = opts.dryRun
  var fresh = opts.fresh

  var sourceCollection = db.collection(sourceCollName)
  var chunkCollection = db.collection(chunkCollName)

  var totalDocs = 0
  var totalChunks = 0
  var skippedDocs = 0

  var skipCount = fresh ? 0 : (opts.skipDocs || 0)

  console.log('[migrate] Starting ' + sourceCollName + ' -> ' + chunkCollName)
  console.log('[migrate] Mode: ' + (fresh ? 'FRESH (drop + insertMany)' : 'UPSERT (resumable)'))
  console.log('[migrate] Embedding field: ' + embeddingField)

  if (fresh && !dryRun) {
    console.log('[migrate] Dropping collection ' + chunkCollName + '...')
    await chunkCollection.drop().catch(function () { /* collection may not exist */ })
    console.log('[migrate] Dropped.')
  }

  // PHASE 1: Fetch ALL eligible _ids in one query (tiny payload, one scan)
  var query = {}
  query[embeddingField] = { $exists: true }
  console.log('[migrate] Phase 1: Fetching all eligible _ids (one scan)...')
  var allIds = await sourceCollection
    .find(query)
    .project({ _id: 1 })
    .sort({ _id: 1 })
    .toArray()

  var totalCount = allIds.length
  console.log('[migrate] Found ' + totalCount + ' documents with embeddings')

  // Apply skip
  if (skipCount > 0) {
    allIds = allIds.slice(skipCount)
    totalDocs = skipCount
    console.log('[migrate] Skipping first ' + skipCount + ' docs, ' + allIds.length + ' remaining')
  }

  // PHASE 2: Fetch in batches by _id using $in (no $exists scan, fewer round-trips)
  var batchSize = opts.batchSize || DEFAULT_BATCH_SIZE
  var startMs = Date.now()
  console.log('[migrate] Phase 2: Processing ' + allIds.length + ' documents in batches of ' + batchSize + '...')

  var projection = { _id: 1 }
  for (var k = 0; k < metadataFields.length; k++) {
    projection[metadataFields[k]] = 1
  }
  projection[embeddingField] = 1

  // Helper: fetch a batch of docs by their _ids
  function fetchBatch(ids) {
    return sourceCollection
      .find({ _id: { $in: ids } })
      .project(projection)
      .toArray()
  }

  // Track seen parentId+chunkIndex pairs across all batches to skip duplicates
  var seenKeys = new Set()

  // Helper: build chunk documents from fetched source docs
  function buildChunkDocs(docs) {
    var chunkDocs = []
    var batchChunks = 0
    var batchSkipped = 0
    var batchDocs = 0
    var batchDuplicates = 0

    for (var i = 0; i < docs.length; i++) {
      var doc = docs[i]
      var chunks = doc[embeddingField]

      if (!Array.isArray(chunks) || chunks.length === 0) {
        batchSkipped++
        batchDocs++
        continue
      }

      var isFlat = typeof chunks[0] === 'number'

      if (isFlat) {
        var key = doc._id.toString() + ':0'
        if (seenKeys.has(key)) {
          batchDuplicates++
        } else {
          seenKeys.add(key)
          var meta = { deleted: false, parentId: doc._id, chunkIndex: 0, embedding: chunks }
          for (var m = 0; m < metadataFields.length; m++) {
            if (doc[metadataFields[m]] !== undefined) meta[metadataFields[m]] = doc[metadataFields[m]]
          }
          chunkDocs.push(meta)
          batchChunks++
        }
      } else {
        for (var j = 0; j < chunks.length; j++) {
          var chunk = chunks[j]
          if (!Array.isArray(chunk) || chunk.length === 0) continue

          var chunkKey = doc._id.toString() + ':' + j
          if (seenKeys.has(chunkKey)) {
            batchDuplicates++
            continue
          }
          seenKeys.add(chunkKey)

          var chunkMeta = { deleted: false, parentId: doc._id, chunkIndex: j, embedding: chunk }
          for (var n = 0; n < metadataFields.length; n++) {
            if (doc[metadataFields[n]] !== undefined) chunkMeta[metadataFields[n]] = doc[metadataFields[n]]
          }
          chunkDocs.push(chunkMeta)
          batchChunks++
        }
      }

      batchDocs++
    }

    return { chunkDocs: chunkDocs, chunks: batchChunks, skipped: batchSkipped, docs: batchDocs, duplicates: batchDuplicates }
  }

  // Build list of batch ID arrays
  var batches = []
  for (var batchStart = 0; batchStart < allIds.length; batchStart += batchSize) {
    batches.push(allIds.slice(batchStart, batchStart + batchSize).map(function (d) { return d._id }))
  }

  // Pipelined processing: fetch next batch while writing current batch
  var pendingFetch = batches.length > 0 ? fetchBatch(batches[0]) : null

  for (var b = 0; b < batches.length; b++) {
    var batchNum = b + 1
    var fetchStart = Date.now()
    var docs = await pendingFetch
    var fetchMs = Date.now() - fetchStart

    // Start fetching next batch immediately (overlaps with ops build + write)
    if (b + 1 < batches.length) {
      pendingFetch = fetchBatch(batches[b + 1])
    }

    var result = buildChunkDocs(docs)
    totalDocs += result.docs
    totalChunks += result.chunks
    skippedDocs += result.skipped

    var writeMs = 0
    if (result.chunkDocs.length > 0 && !dryRun) {
      var writeStart = Date.now()
      if (fresh) {
        await chunkCollection.insertMany(result.chunkDocs, { ordered: false })
      } else {
        var ops = result.chunkDocs.map(function (d) {
          return {
            updateOne: {
              filter: { parentId: d.parentId, chunkIndex: d.chunkIndex },
              update: { $set: d },
              upsert: true
            }
          }
        })
        await chunkCollection.bulkWrite(ops, { ordered: false })
      }
      writeMs = Date.now() - writeStart
    }

    var elapsed = ((Date.now() - startMs) / 1000).toFixed(1)
    var processed = totalDocs - skipCount
    var rate = processed > 0 ? (processed / ((Date.now() - startMs) / 1000)).toFixed(2) : '0'
    var remaining = totalCount - totalDocs
    var eta = rate > 0 ? (remaining / rate).toFixed(0) : '?'
    var logLine = '[migrate] Batch ' + batchNum + '/' + batches.length +
      ' | ' + docs.length + ' docs, ' + result.chunks + ' chunks' +
      ' | fetch=' + fetchMs + 'ms write=' + writeMs + 'ms' +
      ' | PROGRESS: ' + totalDocs + '/' + totalCount +
      ' | ' + rate + ' docs/s' +
      ' | ~' + eta + 's remaining'
    if (result.duplicates > 0) logLine += ' | ' + result.duplicates + ' duplicates skipped'
    console.log(logLine)
  }

  console.log('[migrate] ' + sourceCollName + ' complete: docs=' + totalDocs + ' chunks=' + totalChunks + ' skipped=' + skippedDocs)
  return { docs: totalDocs, chunks: totalChunks, skipped: skippedDocs }
}

async function deduplicateCollection(db, collName) {
  var coll = db.collection(collName)
  console.log('[dedup] Finding duplicates in ' + collName + '...')

  var duplicates = await coll.aggregate([
    { $group: { _id: { parentId: '$parentId', chunkIndex: '$chunkIndex' }, docIds: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]).toArray()

  if (duplicates.length === 0) {
    console.log('[dedup] No duplicates found in ' + collName)
    return 0
  }

  var totalRemoved = 0
  for (var i = 0; i < duplicates.length; i++) {
    // Keep the first doc, delete the rest
    var idsToRemove = duplicates[i].docIds.slice(1)
    await coll.deleteMany({ _id: { $in: idsToRemove } })
    totalRemoved += idsToRemove.length
  }

  console.log('[dedup] Removed ' + totalRemoved + ' duplicate chunks from ' + collName + ' (' + duplicates.length + ' groups)')
  return totalRemoved
}

async function main() {
  var args = parseArgs(process.argv)

  if (!args.mongoUri) {
    console.error('Usage: node scripts/migrate-chunks.js --mongo-uri "mongodb://..." [--db-name apptorney] [--batch-size 200] [--collection case|legislation] [--fresh] [--index-only] [--dry-run]')
    process.exit(1)
  }

  console.log('[migrate] Connecting to MongoDB...')
  console.log('[migrate] Database: ' + args.dbName)
  console.log('[migrate] Batch size: ' + args.batchSize)
  console.log('[migrate] Collections: ' + args.collection)
  console.log('[migrate] Fresh mode: ' + args.fresh)
  console.log('[migrate] Index only: ' + args.indexOnly)
  console.log('[migrate] Dry run: ' + args.dryRun)
  console.log('')

  var client = new MongoClient(args.mongoUri)
  await client.connect()
  console.log('[migrate] Connected successfully!')

  var db = client.db(args.dbName)
  var startMs = Date.now()

  try {
    var caseOpts = {
      sourceCollection: 'case',
      chunkCollection: 'caseChunks',
      embeddingField: 'caseEmbeddingVoyageChunks',
      metadataFields: ['name', 'caseNumber', 'summaryOfRuling', 'summaryOfFacts', 'citation', 'year', 'deleted'],
      batchSize: args.batchSize,
      dryRun: args.dryRun,
      fresh: args.fresh
    }

    var legislationOpts = {
      sourceCollection: 'legislation',
      chunkCollection: 'legislationChunks',
      embeddingField: 'legislationEmbeddingVoyageChunks',
      metadataFields: ['legislationName', 'legislationNumber', 'legislationNumbers', 'preamble', 'dateOfAssent', 'year', 'deleted'],
      batchSize: args.batchSize,
      dryRun: args.dryRun,
      fresh: args.fresh,
      skipDocs: 8080
    }

    if (args.indexOnly) {
      // --index-only: skip migration, dedup + create indexes only
      console.log('[migrate] Index-only mode: skipping data migration')
      console.log('')

      if (args.collection !== 'legislation') {
        await deduplicateCollection(db, 'caseChunks')
        await db.collection('caseChunks').createIndex({ parentId: 1, chunkIndex: 1 }, { unique: true })
        console.log('[migrate] caseChunks index created.')
      }
      if (args.collection !== 'case') {
        await deduplicateCollection(db, 'legislationChunks')
        await db.collection('legislationChunks').createIndex({ parentId: 1, chunkIndex: 1 }, { unique: true })
        console.log('[migrate] legislationChunks index created.')
      }
    } else {
      // Normal migration flow
      // Cases already migrated — skip to legislation
      // if (args.collection !== 'legislation') {
      //   await migrateCollection(db, caseOpts)
      // }
      if (args.collection !== 'case') {
        await migrateCollection(db, legislationOpts)
      }

      if (!args.dryRun) {
        console.log('[migrate] Creating indexes...')
        if (args.collection !== 'legislation') {
          await db.collection('caseChunks').createIndex({ parentId: 1, chunkIndex: 1 }, { unique: true })
          console.log('[migrate] caseChunks index created.')
        }
        if (args.collection !== 'case') {
          await db.collection('legislationChunks').createIndex({ parentId: 1, chunkIndex: 1 }, { unique: true })
          console.log('[migrate] legislationChunks index created.')
        }
      }
    }

    var elapsed = ((Date.now() - startMs) / 1000).toFixed(1)
    console.log('[migrate] Done in ' + elapsed + 's')
    console.log('')
    console.log('=== NEXT STEP ===')
    console.log('Create Atlas Vector Search indexes in the Atlas UI:')
    console.log('')
    console.log('Collection: caseChunks')
    console.log('Index name: caseChunksVectorIndex')
    console.log('Definition:')
    console.log(JSON.stringify({
      fields: [
        { type: 'vector', path: 'embedding', similarity: 'cosine', numDimensions: 1024 },
        { type: 'filter', path: 'deleted' }
      ]
    }, null, 2))
    console.log('')
    console.log('Collection: legislationChunks')
    console.log('Index name: legislationChunksVectorIndex')
    console.log('(same definition as above)')

  } catch (err) {
    console.error('[migrate] Error: ' + err.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()
