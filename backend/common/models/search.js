module.exports = function(Search) {
    const { ObjectId } = require('mongodb') // or ObjectID
    const vectorSearch = require('./shared/vector-search')
    const openaiClient = require('./shared/openai-client')
    const CHAT_THREADS_COLLECTION = 'chatThreads'
    const MAX_THREAD_MESSAGES = 100

    var KeenTracking = require('keen-tracking')

    // This is your actual Project ID and Write Key
    var keenClient = new KeenTracking({
        projectId: '5aaf4c58c9e77c0001692b2b',
        writeKey: 'A730DDA82E082E47030F8A0C43F0E284BD5F445D9969108D5436E1416660AAE5819502658F77A48C2FDED30A4C9113C19BB5265C73F21713E6ED44AADFF35DF5E71EAB2C2A30EE05332027BF733D7615D1F34D4544F1B3A62FFDFA797A912A61'
    })

    function nowMs() {
        return Date.now()
    }

    function parsePositiveInt(value, fallback) {
        var parsed = parseInt(value, 10)
        if (!Number.isFinite(parsed) || parsed <= 0) {
            return fallback
        }
        return parsed
    }

    function normalizeAskAiPayload(payload) {
        if (!payload) {
            return {}
        }

        if (typeof payload === 'string') {
            return { question: payload }
        }

        if (typeof payload !== 'object') {
            return {}
        }

        if (payload.payload && typeof payload.payload === 'object') {
            return Object.assign({}, payload.payload, payload)
        }

        return payload
    }

    function normalizeHistoryMessages(payload, explicitQuestion) {
        var rawHistory = payload.history || payload.chatHistory || payload.messages || payload.conversation || []
        if (!Array.isArray(rawHistory)) {
            return []
        }

        var normalized = []
        for (var i = 0; i < rawHistory.length; i += 1) {
            var item = rawHistory[i]
            if (!item || typeof item !== 'object') {
                continue
            }

            var role = ''
            if (typeof item.role === 'string') {
                role = item.role.toLowerCase()
            } else if (typeof item.sender === 'string') {
                role = item.sender.toLowerCase()
            }
            if (role !== 'user' && role !== 'assistant') {
                continue
            }

            var content = ''
            if (typeof item.content === 'string') {
                content = item.content
            } else if (typeof item.text === 'string') {
                content = item.text
            } else if (Array.isArray(item.content)) {
                var textParts = []
                for (var j = 0; j < item.content.length; j += 1) {
                    var part = item.content[j]
                    if (part && typeof part.text === 'string') {
                        textParts.push(part.text)
                    }
                }
                content = textParts.join('\n')
            }

            if (!content || typeof content !== 'string') {
                continue
            }
            content = content.trim()
            if (!content) {
                continue
            }
            if (content.length > 2500) {
                content = content.slice(0, 2500) + '...'
            }

            normalized.push({ role: role, content: content })
        }

        if (normalized.length && explicitQuestion && typeof explicitQuestion === 'string') {
            var last = normalized[normalized.length - 1]
            if (last.role === 'user' && last.content.trim() === explicitQuestion.trim()) {
                normalized.pop()
            }
        }

        var maxHistoryMessages = parseInt(payload.maxHistoryMessages, 10)
        if (!Number.isFinite(maxHistoryMessages) || maxHistoryMessages <= 0) {
            maxHistoryMessages = 12
        }
        maxHistoryMessages = Math.min(maxHistoryMessages, 20)

        if (normalized.length > maxHistoryMessages) {
            normalized = normalized.slice(normalized.length - maxHistoryMessages)
        }
        return normalized
    }

    function getQuestionFromMessages(payload) {
        var candidates = payload.messages || payload.history || payload.chatHistory || payload.conversation
        if (!Array.isArray(candidates)) {
            return ''
        }
        for (var i = candidates.length - 1; i >= 0; i -= 1) {
            var item = candidates[i]
            if (!item || typeof item !== 'object') {
                continue
            }
            var role = typeof item.role === 'string' ? item.role.toLowerCase() : ''
            if (role !== 'user') {
                continue
            }
            var content = typeof item.content === 'string' ? item.content : (typeof item.text === 'string' ? item.text : '')
            if (content && content.trim().length > 0) {
                return content.trim()
            }
        }
        return ''
    }

    function buildRetrievalQuery(question, historyMessages) {
        if (!Array.isArray(historyMessages) || historyMessages.length === 0) {
            return question
        }

        var recentHistory = historyMessages.slice(Math.max(0, historyMessages.length - 6))
        var historyLines = recentHistory.map(function (msg) {
            return msg.role + ': ' + msg.content
        }).join('\n')

        var combined = 'Conversation so far:\n' + historyLines + '\n\nCurrent question:\n' + question
        if (combined.length > 2200) {
            combined = combined.slice(combined.length - 2200)
        }
        return combined
    }

    function buildThreadTitle(question) {
        var clean = (question || '').replace(/\s+/g, ' ').trim()
        if (!clean) {
            return 'New chat'
        }
        if (clean.length <= 80) {
            return clean
        }
        return clean.slice(0, 77).trim() + '...'
    }

    function authenticationRequiredError() {
        var err = new Error('Authentication required')
        err.statusCode = 401
        return err
    }

    function getAuthenticatedUserId(req) {
        if (!req || !req.accessToken || !req.accessToken.userId) {
            return ''
        }
        return String(req.accessToken.userId)
    }

    function toObjectId(id) {
        if (!id || typeof id !== 'string') {
            return null
        }
        try {
            return new ObjectId(id)
        } catch (err) {
            return null
        }
    }

    function withChatThreadsCollection(cb) {
        var dataSource = Search.getDataSource()
        var connector = dataSource && dataSource.connector
        if (!connector) {
            cb(new Error('Mongo connector is not available'))
            return
        }

        if (connector.db && typeof connector.db.collection === 'function') {
            cb(null, connector.db.collection(CHAT_THREADS_COLLECTION))
            return
        }

        if (typeof connector.connect === 'function') {
            connector.connect(function (err, db) {
                if (err) {
                    cb(err)
                    return
                }
                if (!db || typeof db.collection !== 'function') {
                    cb(new Error('Mongo database handle is not available'))
                    return
                }
                cb(null, db.collection(CHAT_THREADS_COLLECTION))
            })
            return
        }

        cb(new Error('Mongo database handle is not available'))
    }

    function normalizeStoredHistory(history) {
        if (!Array.isArray(history)) {
            return []
        }
        var normalized = []
        for (var i = 0; i < history.length; i += 1) {
            var item = history[i]
            if (!item || typeof item !== 'object') {
                continue
            }
            var role = typeof item.role === 'string' ? item.role.toLowerCase() : ''
            if (role !== 'user' && role !== 'assistant') {
                continue
            }
            var content = typeof item.content === 'string' ? item.content.trim() : ''
            if (!content) {
                continue
            }
            normalized.push({
                role: role,
                content: content
            })
        }
        if (normalized.length > MAX_THREAD_MESSAGES) {
            normalized = normalized.slice(normalized.length - MAX_THREAD_MESSAGES)
        }
        return normalized
    }

    function formatThreadSummary(thread) {
        var history = normalizeStoredHistory(thread.history)
        return {
            id: String(thread._id),
            userId: thread.userId,
            title: thread.title || 'New chat',
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            lastQuestion: thread.lastQuestion || '',
            messageCount: history.length
        }
    }

    function formatThreadDetail(thread) {
        var history = normalizeStoredHistory(thread.history)
        return {
            id: String(thread._id),
            userId: thread.userId,
            title: thread.title || 'New chat',
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            lastQuestion: thread.lastQuestion || '',
            lastAnswer: thread.lastAnswer || '',
            history: history,
            messageCount: history.length
        }
    }

    function saveChatThread(params, cb) {
        var now = new Date()
        var history = normalizeStoredHistory(params.history || [])
        var update = {
            $set: {
                userId: params.userId || 'anonymous',
                title: params.title || 'New chat',
                history: history,
                lastQuestion: params.lastQuestion || '',
                lastAnswer: params.lastAnswer || '',
                lastModel: params.lastModel || '',
                updatedAt: now
            },
            $setOnInsert: {
                createdAt: now
            }
        }

        withChatThreadsCollection(function (collectionErr, collection) {
            if (collectionErr) {
                cb(collectionErr)
                return
            }

            if (params.threadId) {
                collection.findOneAndUpdate(
                    { _id: params.threadId },
                    update,
                    { returnDocument: 'after' },
                    function (err, result) {
                        if (err) {
                            cb(err)
                            return
                        }
                        var value = result && result.value ? result.value : null
                        if (!value) {
                            cb(new Error('Thread not found'))
                            return
                        }
                        cb(null, value)
                    }
                )
                return
            }

            collection.insertOne({
                userId: params.userId || 'anonymous',
                title: params.title || 'New chat',
                history: history,
                lastQuestion: params.lastQuestion || '',
                lastAnswer: params.lastAnswer || '',
                lastModel: params.lastModel || '',
                createdAt: now,
                updatedAt: now
            }, function (err, result) {
                if (err) {
                    cb(err)
                    return
                }
                collection.findOne({ _id: result.insertedId }, function (findErr, threadDoc) {
                    if (findErr) {
                        cb(findErr)
                        return
                    }
                    cb(null, threadDoc)
                })
            })
        })
    }

    function extractQuestion(payload) {
        var candidates = [
            payload.question,
            payload.queryText,
            payload.message,
            payload.prompt,
            payload.text
        ]

        for (var i = 0; i < candidates.length; i += 1) {
            if (typeof candidates[i] === 'string' && candidates[i].trim().length > 0) {
                return candidates[i].trim()
            }
        }

        var fromMessages = getQuestionFromMessages(payload)
        if (fromMessages) {
            return fromMessages
        }

        return ''
    }

    function normalizeWhitespace(value) {
        return String(value || '').replace(/\s+/g, ' ').trim()
    }

    function stripHtml(value) {
        return String(value || '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
    }

    function normalizeForMatch(value) {
        return normalizeWhitespace(stripHtml(value)).toLowerCase()
    }

    function tokenizeQuestion(question) {
        var stopWords = {
            a: true, an: true, and: true, are: true, as: true, at: true,
            be: true, by: true, for: true, from: true, in: true, is: true,
            it: true, of: true, on: true, or: true, that: true, the: true,
            to: true, was: true, were: true, what: true, when: true, where: true,
            which: true, who: true, why: true, will: true, with: true, would: true,
            can: true, could: true, should: true, may: true, might: true, does: true,
            do: true, did: true, under: true, law: true, legal: true
        }

        var cleaned = normalizeForMatch(question).replace(/[^a-z0-9\s-]/g, ' ')
        var rawTokens = cleaned.split(/\s+/)
        var tokens = []
        var seen = {}
        for (var i = 0; i < rawTokens.length; i += 1) {
            var token = rawTokens[i]
            if (!token || token.length < 3 || stopWords[token]) {
                continue
            }
            if (seen[token]) {
                continue
            }
            seen[token] = true
            tokens.push(token)
        }
        return tokens
    }

    function extractQuestionPhrases(question, tokens) {
        var phrases = []
        var normalizedQuestion = normalizeForMatch(question)
        if (normalizedQuestion.length > 0 && normalizedQuestion.length <= 140) {
            phrases.push(normalizedQuestion)
        }

        for (var i = 0; i < tokens.length - 1; i += 1) {
            phrases.push(tokens[i] + ' ' + tokens[i + 1])
        }
        return phrases
    }

    function collectLegislationClauses(parts, parentPath, out) {
        if (!Array.isArray(parts)) {
            return
        }

        for (var i = 0; i < parts.length; i += 1) {
            var part = parts[i]
            if (!part || typeof part !== 'object') {
                continue
            }

            var number = normalizeWhitespace(part.number || '')
            var title = normalizeWhitespace(stripHtml(part.title || ''))
            var heading = normalizeWhitespace((number ? number + ' ' : '') + title)
            var fullHeading = normalizeWhitespace((parentPath ? parentPath + ' > ' : '') + heading)

            var content = ''
            if (typeof part.content === 'string' && part.content.trim()) {
                content = part.content
            } else if (typeof part.flatContentNew === 'string' && part.flatContentNew.trim()) {
                content = part.flatContentNew
            }
            var cleanContent = normalizeWhitespace(stripHtml(content))
            if (cleanContent) {
                out.push({
                    heading: fullHeading || heading || '',
                    text: cleanContent
                })
            }

            var nestedParts = []
            if (Array.isArray(part.subParts)) {
                nestedParts = part.subParts
            } else if (Array.isArray(part.parts)) {
                nestedParts = part.parts
            }

            if (nestedParts.length > 0) {
                collectLegislationClauses(nestedParts, fullHeading || heading || parentPath, out)
            }
        }
    }

    function scoreClause(clause, questionLower, tokens, phrases) {
        var haystack = normalizeForMatch((clause.heading || '') + ' ' + (clause.text || ''))
        var score = 0

        if (questionLower && haystack.indexOf(questionLower) !== -1) {
            score += 120
        }

        for (var i = 0; i < phrases.length; i += 1) {
            if (phrases[i] && haystack.indexOf(phrases[i]) !== -1) {
                score += 20
            }
        }

        for (var j = 0; j < tokens.length; j += 1) {
            if (tokens[j] && haystack.indexOf(tokens[j]) !== -1) {
                score += 6
            }
        }

        return score
    }

    function selectRelevantLegislationClause(legislationDoc, question, maxChars) {
        if (!legislationDoc || typeof legislationDoc !== 'object') {
            return null
        }

        var clauses = []
        collectLegislationClauses(legislationDoc.legislationParts, '', clauses)

        if (!clauses.length && legislationDoc.flattenedParts) {
            clauses.push({
                heading: 'Relevant provisions',
                text: normalizeWhitespace(stripHtml(legislationDoc.flattenedParts))
            })
        }
        if (!clauses.length && legislationDoc.preamble) {
            clauses.push({
                heading: 'Preamble',
                text: normalizeWhitespace(stripHtml(legislationDoc.preamble))
            })
        }
        if (!clauses.length) {
            return null
        }

        var tokens = tokenizeQuestion(question)
        var phrases = extractQuestionPhrases(question, tokens)
        var questionLower = normalizeForMatch(question)

        var best = null
        var bestScore = -1
        for (var i = 0; i < clauses.length; i += 1) {
            var candidate = clauses[i]
            var candidateScore = scoreClause(candidate, questionLower, tokens, phrases)
            if (candidateScore > bestScore) {
                bestScore = candidateScore
                best = candidate
            }
        }

        if (!best) {
            return null
        }

        var snippet = best.text || ''
        if (maxChars > 0 && snippet.length > maxChars) {
            snippet = snippet.slice(0, maxChars) + '...'
        }

        return {
            heading: best.heading || '',
            text: snippet,
            score: bestScore
        }
    }

    function hydrateLegislationContext(results, question, cb) {
        var hydrateTopK = parsePositiveInt(process.env.ASK_AI_HYDRATE_TOP_K, 6)
        hydrateTopK = Math.min(hydrateTopK, 12)
        var clauseMaxChars = parsePositiveInt(process.env.ASK_AI_CLAUSE_MAX_CHARS, 1800)
        var topResults = Array.isArray(results) ? results.slice(0, hydrateTopK) : []
        var legislationIds = []
        var objectIds = []

        for (var i = 0; i < topResults.length; i += 1) {
            var item = topResults[i]
            if (!item || item.type !== 'legislation' || !item.id) {
                continue
            }
            legislationIds.push(String(item.id))
            var parsedId = toObjectId(String(item.id))
            if (parsedId) {
                objectIds.push(parsedId)
            }
        }

        if (!objectIds.length) {
            cb(null, {})
            return
        }

        var dataSource = Search.getDataSource()
        var connector = dataSource && dataSource.connector
        if (!connector || typeof connector.collection !== 'function') {
            cb(new Error('Mongo connector is not available for hydration'))
            return
        }
        var collection = connector.collection('legislation')
        collection.find(
            { _id: { $in: objectIds } },
            {
                projection: {
                    legislationName: true,
                    legislationNumber: true,
                    legislationNumbers: true,
                    preamble: true,
                    flattenedParts: true,
                    legislationParts: true,
                    dateOfAssent: true,
                    year: true
                }
            }
        ).toArray(function (err, docs) {
            if (err) {
                cb(err)
                return
            }

            var byId = {}
            for (var i = 0; i < docs.length; i += 1) {
                byId[String(docs[i]._id)] = docs[i]
            }

            var enriched = {}
            for (var j = 0; j < legislationIds.length; j += 1) {
                var legislationId = legislationIds[j]
                var doc = byId[legislationId]
                if (!doc) {
                    continue
                }
                var bestClause = selectRelevantLegislationClause(doc, question, clauseMaxChars)
                if (!bestClause) {
                    continue
                }
                enriched['legislation:' + legislationId] = {
                    heading: bestClause.heading,
                    text: bestClause.text,
                    score: bestClause.score
                }
            }

            cb(null, enriched)
        })
    }



    Search.remoteMethod(
        'mobilesearch', {
            http: { path: '/mobilesearch', verb: 'get' },
            accepts: { arg: 'term', type: 'string' },
            returns: { arg: 'cases', type: 'Object', root: true }
        })

    Search.remoteMethod(
        'universalVectorSearch', {
            http: { path: '/universal-vector-search', verb: 'post' },
            accepts: { arg: 'payload', type: 'object', http: { source: 'body' } },
            returns: { arg: 'results', type: 'Object', root: true }
        })

    Search.remoteMethod(
        'askAi', {
            http: { path: '/ask-ai', verb: 'get' },
            accepts: [
                { arg: 'question', type: 'string' },
                { arg: 'queryText', type: 'string' },
                { arg: 'message', type: 'string' },
                { arg: 'prompt', type: 'string' },
                { arg: 'text', type: 'string' },
                { arg: 'threadId', type: 'string' },
                { arg: 'retrievalLimit', type: 'number' },
                { arg: 'maxCandidates', type: 'number' },
                { arg: 'includeCases', type: 'boolean' },
                { arg: 'includeLegislations', type: 'boolean' },
                { arg: 'includeDeleted', type: 'boolean' },
                { arg: 'model', type: 'string' },
                { arg: 'temperature', type: 'number' },
                { arg: 'maxTokens', type: 'number' },
                { arg: 'title', type: 'string' },
                { arg: 'maxHistoryMessages', type: 'number' },
                { arg: 'queryVector', type: 'string' },
                { arg: 'historyJson', type: 'string' },
                { arg: 'messagesJson', type: 'string' },
                { arg: 'chatHistoryJson', type: 'string' },
                { arg: 'conversationJson', type: 'string' },
                { arg: 'req', type: 'object', http: { source: 'req' } }
            ],
            returns: { arg: 'response', type: 'Object', root: true }
        })

    Search.remoteMethod(
        'listChatThreads', {
            http: { path: '/chat-threads', verb: 'get' },
            accepts: [
                { arg: 'userId', type: 'string' },
                { arg: 'limit', type: 'number' },
                { arg: 'req', type: 'object', http: { source: 'req' } }
            ],
            returns: { arg: 'threads', type: 'Object', root: true }
        })

    Search.remoteMethod(
        'getChatThread', {
            http: { path: '/chat-threads/:threadId', verb: 'get' },
            accepts: [
                { arg: 'threadId', type: 'string', required: true },
                { arg: 'userId', type: 'string' },
                { arg: 'req', type: 'object', http: { source: 'req' } }
            ],
            returns: { arg: 'thread', type: 'Object', root: true }
        })

    Search.mobilesearch = function(term, cb) {
        var elasticsearch = require('elasticsearch')
        let client = new elasticsearch.Client({
            host: 'https://admin:IULWBNEBWZIVCEAA@portal-ssl480-77.bmix-eu-gb-yp-57296cdb-df3a-492a-ba69-a46f7443cd8f.3432409090.composedb.com:18688/',
            httpAuth: 'admin:IULWBNEBWZIVCEAA'
        })
        var searchParams = {
            index: '_all',
            size: 100,
            body: {
                sort: [{
                    '_score': {
                        'order': 'desc'
                    }
                }],

                query: {
                    //multi_match: { query: term, fields: ['name', 'judgement', 'summaryOfFacts', 'summaryOfRuling', 'areaOfLaw', 'citation'] } // CLR potential infringement
                    multi_match: {
                        query: term,
                        fields: ['name^9', 'judgement', 'areaOfLaw', 'citation', 'generalTitle', 'legislationNumbers', 'legislationNumber', 'preamble', 'legislationName^9', 'flattenedParts'],
                        operator: 'and'
                    }
                },
                highlight: {
                    fields: {
                        '*': { 'pre_tags': ['<strong>'], 'post_tags': ['</strong>'] }
                    }
                },
                //_source: ['name', 'areaOfLaw', 'caseNumber', '_id', 'judgement', 'summaryOfFacts', 'summaryOfRuling', 'citation'] // CLR potential infringement
                _source: ['name', 'areaOfLaw', 'caseNumber', '_id', 'judgement', 'citation', 'legislationName', 'legislationNumbers', 'legislationNumber', '_id', 'preamble', 'flattenedParts', 'legislationType', 'volumeNumber', 'chapterNumber', 'dateOfAssent', 'yearOfAmendment']

            }
        }

        client.search(searchParams).then(function(resp) {
            // console.log(resp.hits)
            let results = []
            resp.hits.hits.forEach(function(h) {
                console.log(h._index)
                if (h._index == "case") {
                    if (h._source.judgement == undefined && h._source.summaryOfFacts == undefined && h._source.summaryOfRuling == undefined) {} else {
                        var highlight = h.highlight
                        var highlights = '...'
                            // console.log(highlight)
                        if (highlight.name !== undefined) {
                            h._source.name = '<b>' + highlight.name[0] + '</b>'
                        } else {
                            h._source.name = '<b>' + h._source.name + '</b>'
                        }
                        if (highlight.summaryOfRuling !== undefined) {
                            highlight.summaryOfRuling.forEach(function(ruling) {
                                highlights = highlights + ruling + '...'
                            })
                            highlights = '<b>Summary of Ruling: </b>' + highlights + '<br>'
                        }

                        if (highlight.summaryOfFacts !== undefined) {
                            highlight.summaryOfFacts.forEach(function(facts) {
                                highlights = highlights + facts + '...'
                            })
                            highlights = (highlight.summaryOfRuling == undefined) ? '<b>Summary of Facts: </b>' + highlights : highlights + '<b>Summary of Facts: </b>' + highlights + '<br>'
                        }

                        if (highlight.judgement !== undefined) {
                            highlight.judgement.forEach(function(judgement) {
                                highlights = highlights + judgement + '...'
                            })
                            highlights = (highlight.summaryOfRuling == undefined && highlight.summaryOfFacts == undefined) ? '<b>Judgment: </b>' + highlights : highlights + '<b>Judgment: </b>' + highlights + '<br>'
                        }

                        h._source.highlight = highlights.length == 3 ? undefined : highlights
                        h._source._id = h._id
                        h._source.areaOfLaw = {
                            'name': h._source.areaOfLaw,
                            '_id': ''
                        }
                        h._source.citation.code = undefined
                        h._source.citation.pageNumber = undefined
                        h._source.type = "Case"

                        results.push(h._source)
                    }
                } else if (h._index == "legislation") {
                    var highlight = h.highlight
                    var highlights = ''
                        // console.log(highlight)
                    if (highlight.legislationName !== undefined) {
                        h._source.legislationName = '<b>' + highlight.legislationName[0] + '</b>'
                    } else {
                        h._source.legislationName = '<b>' + h._source.legislationName + '</b>'
                    }

                    if (highlight.preamble !== undefined) {
                        highlight.preamble.forEach(function(pre) {
                            highlights = highlights + pre + '...'
                        })
                        highlights = '<b>Preamble: </b>' + highlights + '<br>'
                    }

                    if (highlight.flattenedParts !== undefined) {
                        highlight.flattenedParts.forEach(function(pre) {
                            highlights = highlights + pre + '...'
                        })
                        highlights = highlights + '<br>'
                    }

                    if (highlight.legislationNumbers !== undefined) {
                        h._source.legislationNumbers = highlight.legislationNumber ? '<b>' + highlight.legislationNumbers + ', ' + highlight.legislationNumber + '</b>' : '<b>' + highlight.legislationNumbers + '</b>'
                    }

                    h._source.highlight = highlights
                    h._source._id = h._id
                    h._source.type = "Legislation"
                    results.push(h._source)
                }
            });
            keenClient.recordEvent('caseSearches', {
                term: term
            });

            cb(null, results)
        }, function(err) {
            cb(err)
        })
    }

    Search.universalVectorSearch = function (payload, cb) {
        payload = payload || {}
        try {
            var resolveStart = nowMs()
            vectorSearch.resolveQueryVector(payload, function (err, queryVector) {
                if (err) {
                    cb(err)
                    return
                }

                var embedMs = nowMs() - resolveStart
                var searchStart = nowMs()
                var dataSource = Search.getDataSource().connector
                var includeDeleted = payload.includeDeleted === true
                var includeCases = payload.includeCases !== false
                var includeLegislations = payload.includeLegislations !== false
                var limit = vectorSearch.sanitizeLimit(payload.limit)
                var finalResults = []
                var pending = 0
                var stats = {}
                var timings = {
                    embed_ms: embedMs,
                    case_search_ms: null,
                    legislation_search_ms: null,
                    search_ms_total: null
                }
                var finished = false
                var useAtlas = process.env.USE_ATLAS_VECTOR_SEARCH !== 'false'

                function complete(doneErr, result) {
                    if (finished) {
                        return
                    }
                    finished = true
                    cb(doneErr, result)
                }

                function doneOne() {
                    if (finished) {
                        return
                    }
                    pending -= 1
                    if (pending > 0) {
                        return
                    }

                    finalResults.sort(function (a, b) { return b.score - a.score })
                    finalResults = finalResults.slice(0, limit)
                    timings.search_ms_total = nowMs() - searchStart
                    complete(null, {
                        limit: limit,
                        queryDimensions: queryVector.length,
                        stats: stats,
                        timings: timings,
                        searchPath: useAtlas ? 'atlas' : 'app',
                        results: finalResults
                    })
                }

                function fail(searchErr) {
                    complete(searchErr)
                }

                if (includeCases) {
                    pending += 1
                    var caseSearchStart = nowMs()

                    if (useAtlas) {
                        vectorSearch.searchCollectionAtlas({
                            chunkCollection: dataSource.db.collection('caseChunks'),
                            indexName: process.env.ATLAS_CASE_CHUNKS_INDEX || 'caseChunksVectorIndex',
                            queryVector: queryVector,
                            logPrefix: 'vector-search-case-atlas',
                            includeDeleted: includeDeleted,
                            limit: limit,
                            mapResult: function (doc) {
                                return {
                                    id: String(doc._id),
                                    type: 'case',
                                    name: doc.name,
                                    caseNumber: doc.caseNumber,
                                    summaryOfRuling: doc.summaryOfRuling,
                                    summaryOfFacts: doc.summaryOfFacts,
                                    citation: doc.citation,
                                    year: doc.year
                                }
                            }
                        }, function (searchErr, result) {
                            if (searchErr) {
                                fail(searchErr)
                                return
                            }
                            timings.case_search_ms = nowMs() - caseSearchStart
                            stats.case = { scanned: result.scanned, compared: result.compared, path: 'atlas' }
                            finalResults = finalResults.concat(result.results)
                            doneOne()
                        })
                    } else {
                        var caseCollection = dataSource.collection('case')
                        vectorSearch.searchCollection({
                            collection: caseCollection,
                            queryVector: queryVector,
                            logPrefix: 'vector-search-case',
                            embeddingField: 'caseEmbeddingVoyageChunks',
                            limit: limit,
                            maxCandidates: payload.maxCandidates,
                            match: includeDeleted ? {} : { deleted: { $ne: true } },
                        projection: {
                            caseEmbeddingVoyageChunks: true,
                            name: true,
                            caseNumber: true,
                            summaryOfRuling: true,
                            summaryOfFacts: true,
                            citation: true,
                            year: true
                        },
                        mapResult: function (doc) {
                            return {
                                id: String(doc._id),
                                type: 'case',
                                name: doc.name,
                                caseNumber: doc.caseNumber,
                                summaryOfRuling: doc.summaryOfRuling,
                                summaryOfFacts: doc.summaryOfFacts,
                                citation: doc.citation,
                                year: doc.year
                            }
                        }
                    }, function (searchErr, result) {
                            if (searchErr) {
                                fail(searchErr)
                                return
                            }
                            timings.case_search_ms = nowMs() - caseSearchStart
                            stats.case = { scanned: result.scanned, compared: result.compared, path: 'app' }
                            finalResults = finalResults.concat(result.results)
                            doneOne()
                        })
                    }
                }

                if (includeLegislations) {
                    pending += 1
                    var legislationSearchStart = nowMs()

                    if (useAtlas) {
                        vectorSearch.searchCollectionAtlas({
                            chunkCollection: dataSource.db.collection('legislationChunks'),
                            indexName: process.env.ATLAS_LEGISLATION_CHUNKS_INDEX || 'legislationChunksVectorIndex',
                            queryVector: queryVector,
                            logPrefix: 'vector-search-legislation-atlas',
                            includeDeleted: includeDeleted,
                            limit: limit,
                            mapResult: function (doc) {
                                return {
                                    id: String(doc._id),
                                    type: 'legislation',
                                    legislationName: doc.legislationName || doc.name,
                                    legislationNumber: doc.legislationNumber,
                                    legislationNumbers: doc.legislationNumbers,
                                    preamble: doc.preamble,
                                    dateOfAssent: doc.dateOfAssent,
                                    year: doc.year
                                }
                            }
                        }, function (searchErr, result) {
                            if (searchErr) {
                                fail(searchErr)
                                return
                            }
                            timings.legislation_search_ms = nowMs() - legislationSearchStart
                            stats.legislation = { scanned: result.scanned, compared: result.compared, path: 'atlas' }
                            finalResults = finalResults.concat(result.results)
                            doneOne()
                        })
                    } else {
                        var legislationCollection = dataSource.collection('legislation')
                        vectorSearch.searchCollection({
                            collection: legislationCollection,
                            queryVector: queryVector,
                            logPrefix: 'vector-search-legislation',
                            embeddingField: 'legislationEmbeddingVoyageChunks',
                            limit: limit,
                            maxCandidates: payload.maxCandidates,
                            match: includeDeleted ? {} : { deleted: { $ne: true } },
                        projection: {
                            legislationEmbeddingVoyageChunks: true,
                            legislationName: true,
                            legislationNumber: true,
                            legislationNumbers: true,
                            preamble: true,
                            dateOfAssent: true,
                            year: true
                        },
                        mapResult: function (doc) {
                            return {
                                id: String(doc._id),
                                type: 'legislation',
                                legislationName: doc.legislationName,
                                legislationNumber: doc.legislationNumber,
                                legislationNumbers: doc.legislationNumbers,
                                preamble: doc.preamble,
                                dateOfAssent: doc.dateOfAssent,
                                year: doc.year
                            }
                        }
                    }, function (searchErr, result) {
                            if (searchErr) {
                                fail(searchErr)
                                return
                            }
                            timings.legislation_search_ms = nowMs() - legislationSearchStart
                            stats.legislation = { scanned: result.scanned, compared: result.compared, path: 'app' }
                            finalResults = finalResults.concat(result.results)
                            doneOne()
                        })
                    }
                }

                if (pending === 0) {
                    complete(new Error('At least one of includeCases/includeLegislations must be true'))
                }
            })
        } catch (err) {
            cb(err)
        }
    }

    Search.listChatThreads = function (userId, limit, req, cb) {
        var authUserId = getAuthenticatedUserId(req)
        if (!authUserId) {
            cb(authenticationRequiredError())
            return
        }

        var parsedLimit = parseInt(limit, 10)
        if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
            parsedLimit = 20
        }
        parsedLimit = Math.min(parsedLimit, 100)

        var query = { userId: authUserId }

        withChatThreadsCollection(function (collectionErr, collection) {
            if (collectionErr) {
                cb(collectionErr)
                return
            }

            collection
                .find(query)
                .sort({ updatedAt: -1 })
                .limit(parsedLimit)
                .toArray(function (err, docs) {
                    if (err) {
                        cb(err)
                        return
                    }
                    cb(null, {
                        limit: parsedLimit,
                        count: docs.length,
                        threads: docs.map(formatThreadSummary)
                    })
                })
        })
    }

    Search.getChatThread = function (threadId, userId, req, cb) {
        var authUserId = getAuthenticatedUserId(req)
        if (!authUserId) {
            cb(authenticationRequiredError())
            return
        }

        var objectId = toObjectId(threadId)
        if (!objectId) {
            cb(new Error('Invalid threadId'))
            return
        }

        var query = { _id: objectId, userId: authUserId }

        withChatThreadsCollection(function (collectionErr, collection) {
            if (collectionErr) {
                cb(collectionErr)
                return
            }
            collection.findOne(query, function (err, doc) {
                if (err) {
                    cb(err)
                    return
                }
                if (!doc) {
                    cb(new Error('Thread not found'))
                    return
                }
                cb(null, formatThreadDetail(doc))
            })
        })
    }

    Search.askAi = function (
        question,
        queryText,
        message,
        prompt,
        text,
        threadId,
        retrievalLimit,
        maxCandidates,
        includeCases,
        includeLegislations,
        includeDeleted,
        model,
        temperature,
        maxTokens,
        title,
        maxHistoryMessages,
        queryVector,
        historyJson,
        messagesJson,
        chatHistoryJson,
        conversationJson,
        req,
        cb
    ) {
        console.log('askAi called with question:', question, 'threadId:', threadId)
        var requestStart = nowMs()
        var askAiRequestId = 'askai-' + requestStart + '-' + Math.floor(Math.random() * 100000)
        var requestPayload = normalizeAskAiPayload({
            question: question,
            queryText: queryText,
            message: message,
            prompt: prompt,
            text: text,
            threadId: threadId,
            retrievalLimit: retrievalLimit,
            maxCandidates: maxCandidates,
            includeCases: includeCases,
            includeLegislations: includeLegislations,
            includeDeleted: includeDeleted,
            model: model,
            temperature: temperature,
            maxTokens: maxTokens,
            title: title,
            maxHistoryMessages: maxHistoryMessages,
            queryVector: queryVector
        })

        function tryParseJsonArray(raw) {
            if (!raw || typeof raw !== 'string') {
                return null
            }
            try {
                var parsed = JSON.parse(raw)
                return Array.isArray(parsed) ? parsed : null
            } catch (err) {
                return null
            }
        }

        var parsedHistory = tryParseJsonArray(historyJson)
        if (parsedHistory) {
            requestPayload.history = parsedHistory
        }
        var parsedMessages = tryParseJsonArray(messagesJson)
        if (parsedMessages) {
            requestPayload.messages = parsedMessages
        }
        var parsedChatHistory = tryParseJsonArray(chatHistoryJson)
        if (parsedChatHistory) {
            requestPayload.chatHistory = parsedChatHistory
        }
        var parsedConversation = tryParseJsonArray(conversationJson)
        if (parsedConversation) {
            requestPayload.conversation = parsedConversation
        }

        var question = extractQuestion(requestPayload)
        var userId = getAuthenticatedUserId(req)
        if (!userId) {
            cb(authenticationRequiredError())
            return
        }
        var providedThreadId = toObjectId(requestPayload.threadId)

        if (requestPayload.threadId && !providedThreadId) {
            cb(new Error('Invalid threadId'))
            return
        }

        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            cb(new Error('question is required (send JSON body with question, queryText, message, prompt, or text)'))
            return
        }

        var retrievalLimit = parseInt(requestPayload.retrievalLimit, 10)
        if (!Number.isFinite(retrievalLimit) || retrievalLimit <= 0) {
            retrievalLimit = 12
        }
        retrievalLimit = Math.min(retrievalLimit, 30)

        var defaultMaxCandidates = parsePositiveInt(process.env.ASK_AI_MAX_CANDIDATES_DEFAULT, 600)
        var maxCandidatesCap = parsePositiveInt(process.env.ASK_AI_MAX_CANDIDATES_CAP, 2000)
        var resolvedMaxCandidates = parsePositiveInt(requestPayload.maxCandidates, defaultMaxCandidates)
        resolvedMaxCandidates = Math.min(resolvedMaxCandidates, maxCandidatesCap)

        var defaultContextItems = parsePositiveInt(process.env.ASK_AI_CONTEXT_ITEMS_DEFAULT, 8)
        var maxContextItemsCap = parsePositiveInt(process.env.ASK_AI_CONTEXT_ITEMS_CAP, 12)
        var resolvedContextItems = parsePositiveInt(requestPayload.contextLimit || requestPayload.maxContextItems, defaultContextItems)
        resolvedContextItems = Math.min(resolvedContextItems, maxContextItemsCap)

        var snippetMaxChars = parsePositiveInt(process.env.ASK_AI_SNIPPET_MAX_CHARS, 1200)

        function runWithThread(existingThread) {
            var threadHistory = existingThread ? normalizeStoredHistory(existingThread.history) : []
            var incomingHistory = normalizeHistoryMessages(requestPayload, question)
            var historyMessages = incomingHistory.length ? incomingHistory : threadHistory

            var retrievalStart = nowMs()
            var retrievalQueryText = buildRetrievalQuery(question, historyMessages)
            console.log('[ask-ai-stage] ' + askAiRequestId + ' retrieval:start chars=' + retrievalQueryText.length + ' limit=' + retrievalLimit + ' maxCandidates=' + resolvedMaxCandidates)
            Search.universalVectorSearch({
                queryText: retrievalQueryText,
                queryVector: requestPayload.queryVector,
                limit: retrievalLimit,
                maxCandidates: resolvedMaxCandidates,
                includeCases: requestPayload.includeCases,
                includeLegislations: requestPayload.includeLegislations,
                includeDeleted: requestPayload.includeDeleted === true
            }, function (retrievalErr, retrieval) {
                if (retrievalErr) {
                    cb(retrievalErr)
                    return
                }
                var retrievalMs = nowMs() - retrievalStart
                console.log('[ask-ai-stage] ' + askAiRequestId + ' retrieval:done ms=' + retrievalMs)

                var results = retrieval.results || []
                var hydrationStart = nowMs()
                console.log('[ask-ai-stage] ' + askAiRequestId + ' hydration:start top_results=' + results.length)
                hydrateLegislationContext(results, question.trim(), function (hydrationErr, hydratedLegislation) {
                    if (hydrationErr) {
                        console.log('[ask-ai-hydration-error] ' + hydrationErr.message)
                    }
                    var hydrationMs = nowMs() - hydrationStart
                    var hydratedMap = hydrationErr ? {} : (hydratedLegislation || {})
                    console.log('[ask-ai-stage] ' + askAiRequestId + ' hydration:done ms=' + hydrationMs + ' clauses=' + Object.keys(hydratedMap).length)

                    var contextLines = []
                    var sources = []
                    var maxContextItems = Math.min(results.length, resolvedContextItems)

                    for (var i = 0; i < maxContextItems; i += 1) {
                        var item = results[i]
                        var label = 'S' + (i + 1)
                        var title = item.type === 'case'
                            ? (item.name || 'Untitled case')
                            : (item.legislationName || 'Untitled legislation')
                        var snippetParts = []
                        var legislationHydration = null
                        if (item.type === 'legislation') {
                            legislationHydration = hydratedMap['legislation:' + item.id] || null
                        }
                        if (item.summaryOfRuling) {
                            snippetParts.push('Summary of ruling: ' + item.summaryOfRuling)
                        }
                        if (item.summaryOfFacts) {
                            snippetParts.push('Summary of facts: ' + item.summaryOfFacts)
                        }
                        if (item.judgement) {
                            snippetParts.push('Judgment: ' + item.judgement)
                        }
                        if (legislationHydration && legislationHydration.text) {
                            snippetParts.unshift('Relevant clause: ' + legislationHydration.text)
                        } else if (item.preamble) {
                            snippetParts.push('Preamble: ' + item.preamble)
                        }
                        if (item.flattenedParts) {
                            snippetParts.push('Relevant provisions: ' + item.flattenedParts)
                        }
                        var snippet = snippetParts.join('\n')
                        if (snippet.length > snippetMaxChars) {
                            snippet = snippet.slice(0, snippetMaxChars) + '...'
                        }

                        contextLines.push('[' + label + '] ' + item.type.toUpperCase() + ' | id=' + item.id + ' | title=' + title)
                        if (item.caseNumber) {
                            contextLines.push('[' + label + '] caseNumber: ' + item.caseNumber)
                        }
                        if (item.citation) {
                            contextLines.push('[' + label + '] citation: ' + JSON.stringify(item.citation))
                        }
                        if (item.legislationNumber || item.legislationNumbers) {
                            contextLines.push('[' + label + '] legislation references: ' + (item.legislationNumber || '') + ' ' + (item.legislationNumbers || ''))
                        }
                        if (item.dateOfAssent) {
                            contextLines.push('[' + label + '] dateOfAssent: ' + item.dateOfAssent)
                        }
                        if (item.year) {
                            contextLines.push('[' + label + '] year: ' + item.year)
                        }
                        if (legislationHydration && legislationHydration.heading) {
                            contextLines.push('[' + label + '] clause heading: ' + legislationHydration.heading)
                        }
                        if (snippet) {
                            contextLines.push('[' + label + '] snippet: ' + snippet)
                        }

                        sources.push({
                            source: label,
                            id: item.id,
                            type: item.type,
                            title: title,
                            score: item.score,
                            clauseHeading: legislationHydration ? legislationHydration.heading : undefined,
                            clauseScore: legislationHydration ? legislationHydration.score : undefined
                        })
                    }

                    var systemPrompt =
                        'You are a legal research assistant for Apptorney. ' +
                        'Answer the user question directly and naturally, without meta lead-ins. ' +
                        'Do not start with phrases like "The context provides", "Based on the provided context", ' +
                        '"According to the materials you have provided", or any similar reference to materials being provided. ' +
                        'The legal materials come from the Apptorney platform, not from the user — never imply the user supplied them. ' +
                        'Provide a complete, high-quality answer with practical detail and clear reasoning. ' +
                        'Use only the supplied context for factual claims. ' +
                        'If information is missing, say so briefly in plain language. ' +
                        'Cite sources inline as [S1], [S2]. Do not invent citations.'

                    var userPrompt =
                        'Question:\n' + question.trim() + '\n\n' +
                        'Context:\n' + (contextLines.length ? contextLines.join('\n') : 'No context available.')

                    var maxTokens = parseInt(requestPayload.maxTokens, 10)
                    if (!Number.isFinite(maxTokens) || maxTokens <= 0) {
                        maxTokens = 1200
                    }

                    var openAiStart = nowMs()
                    console.log('[ask-ai-stage] ' + askAiRequestId + ' openai:start context_items=' + maxContextItems + ' context_chars=' + userPrompt.length)
                    openaiClient.createChatCompletion({
                        model: requestPayload.model,
                        temperature: typeof requestPayload.temperature === 'number' ? requestPayload.temperature : 0.1,
                        maxTokens: maxTokens,
                        messages: [{ role: 'system', content: systemPrompt }]
                            .concat(historyMessages)
                            .concat([{ role: 'user', content: userPrompt }])
                    }, function (aiErr, aiResponse) {
                        if (aiErr) {
                            cb(aiErr)
                            return
                        }

                        var openAiMs = nowMs() - openAiStart
                        console.log('[ask-ai-stage] ' + askAiRequestId + ' openai:done ms=' + openAiMs)
                        var totalMs = nowMs() - requestStart
                        var retrievalTimings = retrieval.timings || {}
                        var latency = {
                            embed_ms: retrievalTimings.embed_ms,
                            search_ms: retrievalTimings.search_ms_total,
                            retrieval_ms: retrievalMs,
                            hydration_ms: hydrationMs,
                            openai_ms: openAiMs,
                            total_ms: totalMs
                        }

                        var finalHistory = historyMessages
                            .concat([{ role: 'user', content: question.trim() }])
                            .concat([{ role: 'assistant', content: aiResponse.text }])
                        if (finalHistory.length > MAX_THREAD_MESSAGES) {
                            finalHistory = finalHistory.slice(finalHistory.length - MAX_THREAD_MESSAGES)
                        }

                        var threadTitle = (existingThread && existingThread.title)
                            ? existingThread.title
                            : (typeof requestPayload.title === 'string' && requestPayload.title.trim()
                                ? requestPayload.title.trim()
                                : buildThreadTitle(question))

                        saveChatThread({
                            threadId: existingThread ? existingThread._id : providedThreadId,
                            userId: userId,
                            title: threadTitle,
                            history: finalHistory,
                            lastQuestion: question.trim(),
                            lastAnswer: aiResponse.text,
                            lastModel: aiResponse.model
                        }, function (saveErr, savedThread) {
                            var threadSummary = savedThread ? formatThreadSummary(savedThread) : null

                            if (saveErr) {
                                console.log('[ask-ai-thread-save-error] ' + saveErr.message)
                            }
                            console.log('[ask-ai-latency] ' + JSON.stringify({
                                question_chars: question.trim().length,
                                history_messages: historyMessages.length,
                                retrieval_query_chars: retrievalQueryText.length,
                                results: results.length,
                                retrieval_limit: retrievalLimit,
                                embed_ms: latency.embed_ms,
                                search_ms: latency.search_ms,
                                retrieval_ms: latency.retrieval_ms,
                                hydration_ms: latency.hydration_ms,
                                openai_ms: latency.openai_ms,
                                total_ms: latency.total_ms
                            }))

                            cb(null, {
                                question: question.trim(),
                                answer: aiResponse.text,
                                model: aiResponse.model,
                                usage: aiResponse.usage,
                                sources: sources,
                                retrieval: {
                                    limit: retrieval.limit,
                                    queryDimensions: retrieval.queryDimensions,
                                    stats: retrieval.stats,
                                    timings: retrieval.timings,
                                    hydratedLegislations: Object.keys(hydratedMap).length
                                },
                                historyUsedCount: historyMessages.length,
                                thread: threadSummary,
                                threadSaveError: saveErr ? saveErr.message : null,
                                latency: latency
                            })
                        })
                    })
                })
            })
        }

        if (!providedThreadId) {
            runWithThread(null)
            return
        }

        var threadQuery = { _id: providedThreadId, userId: userId }
        withChatThreadsCollection(function (collectionErr, collection) {
            if (collectionErr) {
                cb(collectionErr)
                return
            }
            collection.findOne(threadQuery, function (err, threadDoc) {
                if (err) {
                    cb(err)
                    return
                }
                if (!threadDoc) {
                    cb(new Error('Thread not found'))
                    return
                }
                runWithThread(threadDoc)
            })
        })
    }

    /**
     * SSE streaming version of askAi.
     * Runs the full retrieval pipeline, then streams the OpenAI response token-by-token.
     * Called directly from the route handler with (payload, req, res).
     */
    /**
     * Public (no-auth) version of askAi for website visitors.
     * - No authentication required
     * - Response capped at 300 words via system prompt + maxTokens
     * - No thread persistence or conversation history
     * - Supports both regular and streaming responses
     */
    Search.askAiPublic = function (question, stream, req, res, cb) {
        var requestStart = nowMs()
        var askAiRequestId = 'askai-public-' + requestStart + '-' + Math.floor(Math.random() * 100000)
        console.log('[ask-ai-public] ' + askAiRequestId + ' called with question:', question)

        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            if (stream && res) {
                res.status(400).json({ error: 'question is required' })
            } else {
                cb(new Error('question is required'))
            }
            return
        }

        var retrievalLimit = 8
        var defaultMaxCandidates = parsePositiveInt(process.env.ASK_AI_MAX_CANDIDATES_DEFAULT, 600)
        var resolvedMaxCandidates = Math.min(defaultMaxCandidates, 600)
        var defaultContextItems = parsePositiveInt(process.env.ASK_AI_CONTEXT_ITEMS_DEFAULT, 8)
        var resolvedContextItems = Math.min(defaultContextItems, 6)
        var snippetMaxChars = parsePositiveInt(process.env.ASK_AI_SNIPPET_MAX_CHARS, 1200)

        var retrievalStart = nowMs()
        var retrievalQueryText = question.trim()
        console.log('[ask-ai-public] ' + askAiRequestId + ' retrieval:start')

        Search.universalVectorSearch({
            queryText: retrievalQueryText,
            limit: retrievalLimit,
            maxCandidates: resolvedMaxCandidates,
            includeCases: true,
            includeLegislations: true,
            includeDeleted: false
        }, function (retrievalErr, retrieval) {
            if (retrievalErr) {
                if (stream && res) {
                    res.status(500).json({ error: retrievalErr.message })
                } else {
                    cb(retrievalErr)
                }
                return
            }
            var retrievalMs = nowMs() - retrievalStart
            console.log('[ask-ai-public] ' + askAiRequestId + ' retrieval:done ms=' + retrievalMs)

            var results = retrieval.results || []
            var hydrationStart = nowMs()

            hydrateLegislationContext(results, question.trim(), function (hydrationErr, hydratedLegislation) {
                if (hydrationErr) {
                    console.log('[ask-ai-public-hydration-error] ' + hydrationErr.message)
                }
                var hydrationMs = nowMs() - hydrationStart
                var hydratedMap = hydrationErr ? {} : (hydratedLegislation || {})
                console.log('[ask-ai-public] ' + askAiRequestId + ' hydration:done ms=' + hydrationMs)

                var contextLines = []
                var sources = []
                var maxContextItems = Math.min(results.length, resolvedContextItems)

                for (var i = 0; i < maxContextItems; i += 1) {
                    var item = results[i]
                    var label = 'S' + (i + 1)
                    var title = item.type === 'case'
                        ? (item.name || 'Untitled case')
                        : (item.legislationName || 'Untitled legislation')
                    var snippetParts = []
                    var legislationHydration = null
                    if (item.type === 'legislation') {
                        legislationHydration = hydratedMap['legislation:' + item.id] || null
                    }
                    if (item.summaryOfRuling) {
                        snippetParts.push('Summary of ruling: ' + item.summaryOfRuling)
                    }
                    if (item.summaryOfFacts) {
                        snippetParts.push('Summary of facts: ' + item.summaryOfFacts)
                    }
                    if (item.judgement) {
                        snippetParts.push('Judgment: ' + item.judgement)
                    }
                    if (legislationHydration && legislationHydration.text) {
                        snippetParts.unshift('Relevant clause: ' + legislationHydration.text)
                    } else if (item.preamble) {
                        snippetParts.push('Preamble: ' + item.preamble)
                    }
                    if (item.flattenedParts) {
                        snippetParts.push('Relevant provisions: ' + item.flattenedParts)
                    }
                    var snippet = snippetParts.join('\n')
                    if (snippet.length > snippetMaxChars) {
                        snippet = snippet.slice(0, snippetMaxChars) + '...'
                    }

                    contextLines.push('[' + label + '] ' + item.type.toUpperCase() + ' | id=' + item.id + ' | title=' + title)
                    if (item.caseNumber) {
                        contextLines.push('[' + label + '] caseNumber: ' + item.caseNumber)
                    }
                    if (item.citation) {
                        contextLines.push('[' + label + '] citation: ' + JSON.stringify(item.citation))
                    }
                    if (item.legislationNumber || item.legislationNumbers) {
                        contextLines.push('[' + label + '] legislation references: ' + (item.legislationNumber || '') + ' ' + (item.legislationNumbers || ''))
                    }
                    if (item.dateOfAssent) {
                        contextLines.push('[' + label + '] dateOfAssent: ' + item.dateOfAssent)
                    }
                    if (item.year) {
                        contextLines.push('[' + label + '] year: ' + item.year)
                    }
                    if (legislationHydration && legislationHydration.heading) {
                        contextLines.push('[' + label + '] clause heading: ' + legislationHydration.heading)
                    }
                    if (snippet) {
                        contextLines.push('[' + label + '] snippet: ' + snippet)
                    }

                    sources.push({
                        source: label,
                        id: item.id,
                        type: item.type,
                        title: title,
                        score: item.score,
                        clauseHeading: legislationHydration ? legislationHydration.heading : undefined,
                        clauseScore: legislationHydration ? legislationHydration.score : undefined
                    })
                }

                var systemPrompt =
                    'You are a legal research assistant for Apptorney. ' +
                    'Answer the user question directly and naturally, without meta lead-ins. ' +
                    'Do not start with phrases like "The context provides", "Based on the provided context", ' +
                    '"According to the materials you have provided", or any similar reference to materials being provided. ' +
                    'The legal materials come from the Apptorney platform, not from the user — never imply the user supplied them. ' +
                    'Provide a concise answer with practical detail and clear reasoning. ' +
                    'Use only the supplied context for factual claims. ' +
                    'If information is missing, say so briefly in plain language. ' +
                    'Cite sources inline as [S1], [S2]. Do not invent citations. ' +
                    'IMPORTANT: Your response MUST be 300 words or fewer. Be concise.'

                var userPrompt =
                    'Question:\n' + question.trim() + '\n\n' +
                    'Context:\n' + (contextLines.length ? contextLines.join('\n') : 'No context available.')

                // ~400 tokens ≈ 300 words
                var maxTokens = 400

                var retrievalTimings = retrieval.timings || {}

                if (stream && res) {
                    // --- SSE streaming path ---
                    function sendSSE(event, data) {
                        if (res.finished) return
                        res.write('event: ' + event + '\ndata: ' + JSON.stringify(data) + '\n\n')
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'X-Accel-Buffering': 'no'
                    })

                    sendSSE('metadata', {
                        question: question.trim(),
                        sources: sources,
                        retrieval: {
                            limit: retrieval.limit,
                            queryDimensions: retrieval.queryDimensions,
                            stats: retrieval.stats,
                            timings: retrieval.timings,
                            searchPath: retrieval.searchPath,
                            hydratedLegislations: Object.keys(hydratedMap).length
                        },
                        latency: {
                            embed_ms: retrievalTimings.embed_ms,
                            search_ms: retrievalTimings.search_ms_total,
                            retrieval_ms: retrievalMs,
                            hydration_ms: hydrationMs
                        }
                    })

                    var openAiStart = nowMs()
                    openaiClient.createStreamingChatCompletion({
                        temperature: 0.1,
                        maxTokens: maxTokens,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    }, {
                        onToken: function (text) {
                            sendSSE('token', { text: text })
                        },
                        onDone: function (aiResponse) {
                            var openAiMs = nowMs() - openAiStart
                            var totalMs = nowMs() - requestStart
                            console.log('[ask-ai-public] ' + askAiRequestId + ' openai:done ms=' + openAiMs + ' total_ms=' + totalMs)

                            sendSSE('done', {
                                answer: aiResponse.text,
                                model: aiResponse.model,
                                usage: aiResponse.usage,
                                latency: {
                                    embed_ms: retrievalTimings.embed_ms,
                                    search_ms: retrievalTimings.search_ms_total,
                                    retrieval_ms: retrievalMs,
                                    hydration_ms: hydrationMs,
                                    openai_ms: openAiMs,
                                    total_ms: totalMs
                                }
                            })
                            res.end()
                        },
                        onError: function (err) {
                            console.error('[ask-ai-public] ' + askAiRequestId + ' openai:error ' + err.message)
                            sendSSE('error', { message: err.message })
                            res.end()
                        }
                    })

                    req.on('close', function () {
                        console.log('[ask-ai-public] ' + askAiRequestId + ' client disconnected')
                    })
                } else {
                    // --- Regular (non-streaming) path ---
                    var openAiStart = nowMs()
                    console.log('[ask-ai-public] ' + askAiRequestId + ' openai:start')
                    openaiClient.createChatCompletion({
                        temperature: 0.1,
                        maxTokens: maxTokens,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    }, function (aiErr, aiResponse) {
                        if (aiErr) {
                            cb(aiErr)
                            return
                        }

                        var openAiMs = nowMs() - openAiStart
                        var totalMs = nowMs() - requestStart
                        console.log('[ask-ai-public] ' + askAiRequestId + ' openai:done ms=' + openAiMs + ' total_ms=' + totalMs)

                        cb(null, {
                            question: question.trim(),
                            answer: aiResponse.text,
                            model: aiResponse.model,
                            usage: aiResponse.usage,
                            sources: sources,
                            retrieval: {
                                limit: retrieval.limit,
                                queryDimensions: retrieval.queryDimensions,
                                stats: retrieval.stats,
                                timings: retrieval.timings,
                                hydratedLegislations: Object.keys(hydratedMap).length
                            },
                            latency: {
                                embed_ms: retrievalTimings.embed_ms,
                                search_ms: retrievalTimings.search_ms_total,
                                retrieval_ms: retrievalMs,
                                hydration_ms: hydrationMs,
                                openai_ms: openAiMs,
                                total_ms: totalMs
                            }
                        })
                    })
                }
            })
        })
    }

    Search.askAiStream = function (payload, req, res) {
        var requestStart = nowMs()
        var askAiRequestId = 'askai-stream-' + requestStart + '-' + Math.floor(Math.random() * 100000)

        payload = normalizeAskAiPayload(payload)

        // Parse JSON-encoded history fields (same as askAi)
        function tryParseJsonArray(raw) {
            if (!raw || typeof raw !== 'string') return null
            try {
                var parsed = JSON.parse(raw)
                return Array.isArray(parsed) ? parsed : null
            } catch (e) { return null }
        }
        var parsedHistory = tryParseJsonArray(payload.historyJson)
        if (parsedHistory) { payload.history = parsedHistory }
        var parsedMessages = tryParseJsonArray(payload.messagesJson)
        if (parsedMessages) { payload.messages = parsedMessages }
        var parsedChatHistory = tryParseJsonArray(payload.chatHistoryJson)
        if (parsedChatHistory) { payload.chatHistory = parsedChatHistory }
        var parsedConversation = tryParseJsonArray(payload.conversationJson)
        if (parsedConversation) { payload.conversation = parsedConversation }

        var question = extractQuestion(payload)
        var userId = getAuthenticatedUserId(req)

        // Validation — errors sent as JSON before stream opens
        if (!userId) {
            var authErr = new Error('Authentication required')
            authErr.statusCode = 401
            res.status(401).json({ error: authErr.message })
            return
        }

        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            res.status(400).json({ error: 'question is required' })
            return
        }

        var providedThreadId = toObjectId(payload.threadId)
        if (payload.threadId && !providedThreadId) {
            res.status(400).json({ error: 'Invalid threadId' })
            return
        }

        var retrievalLimit = parseInt(payload.retrievalLimit, 10)
        if (!Number.isFinite(retrievalLimit) || retrievalLimit <= 0) {
            retrievalLimit = 12
        }
        retrievalLimit = Math.min(retrievalLimit, 30)

        var defaultMaxCandidates = parsePositiveInt(process.env.ASK_AI_MAX_CANDIDATES_DEFAULT, 600)
        var maxCandidatesCap = parsePositiveInt(process.env.ASK_AI_MAX_CANDIDATES_CAP, 2000)
        var resolvedMaxCandidates = parsePositiveInt(payload.maxCandidates, defaultMaxCandidates)
        resolvedMaxCandidates = Math.min(resolvedMaxCandidates, maxCandidatesCap)

        var defaultContextItems = parsePositiveInt(process.env.ASK_AI_CONTEXT_ITEMS_DEFAULT, 8)
        var maxContextItemsCap = parsePositiveInt(process.env.ASK_AI_CONTEXT_ITEMS_CAP, 12)
        var resolvedContextItems = parsePositiveInt(payload.contextLimit || payload.maxContextItems, defaultContextItems)
        resolvedContextItems = Math.min(resolvedContextItems, maxContextItemsCap)

        var snippetMaxChars = parsePositiveInt(process.env.ASK_AI_SNIPPET_MAX_CHARS, 1200)

        function sendSSE(event, data) {
            if (res.finished) return
            res.write('event: ' + event + '\ndata: ' + JSON.stringify(data) + '\n\n')
        }

        function runStreamWithThread(existingThread) {
            var threadHistory = existingThread ? normalizeStoredHistory(existingThread.history) : []
            var incomingHistory = normalizeHistoryMessages(payload, question)
            var historyMessages = incomingHistory.length ? incomingHistory : threadHistory

            var retrievalStart = nowMs()
            var retrievalQueryText = buildRetrievalQuery(question, historyMessages)
            console.log('[ask-ai-stream] ' + askAiRequestId + ' retrieval:start')

            Search.universalVectorSearch({
                queryText: retrievalQueryText,
                queryVector: payload.queryVector,
                limit: retrievalLimit,
                maxCandidates: resolvedMaxCandidates,
                includeCases: payload.includeCases,
                includeLegislations: payload.includeLegislations,
                includeDeleted: payload.includeDeleted === true
            }, function (retrievalErr, retrieval) {
                if (retrievalErr) {
                    res.status(500).json({ error: retrievalErr.message })
                    return
                }
                var retrievalMs = nowMs() - retrievalStart
                console.log('[ask-ai-stream] ' + askAiRequestId + ' retrieval:done ms=' + retrievalMs)

                var results = retrieval.results || []
                var hydrationStart = nowMs()

                hydrateLegislationContext(results, question.trim(), function (hydrationErr, hydratedLegislation) {
                    if (hydrationErr) {
                        console.log('[ask-ai-stream-hydration-error] ' + hydrationErr.message)
                    }
                    var hydrationMs = nowMs() - hydrationStart
                    var hydratedMap = hydrationErr ? {} : (hydratedLegislation || {})
                    console.log('[ask-ai-stream] ' + askAiRequestId + ' hydration:done ms=' + hydrationMs)

                    // Build context (same logic as askAi)
                    var contextLines = []
                    var sources = []
                    var maxContextItems = Math.min(results.length, resolvedContextItems)

                    for (var i = 0; i < maxContextItems; i += 1) {
                        var item = results[i]
                        var label = 'S' + (i + 1)
                        var title = item.type === 'case'
                            ? (item.name || 'Untitled case')
                            : (item.legislationName || 'Untitled legislation')
                        var snippetParts = []
                        var legislationHydration = null
                        if (item.type === 'legislation') {
                            legislationHydration = hydratedMap['legislation:' + item.id] || null
                        }
                        if (item.summaryOfRuling) {
                            snippetParts.push('Summary of ruling: ' + item.summaryOfRuling)
                        }
                        if (item.summaryOfFacts) {
                            snippetParts.push('Summary of facts: ' + item.summaryOfFacts)
                        }
                        if (item.judgement) {
                            snippetParts.push('Judgment: ' + item.judgement)
                        }
                        if (legislationHydration && legislationHydration.text) {
                            snippetParts.unshift('Relevant clause: ' + legislationHydration.text)
                        } else if (item.preamble) {
                            snippetParts.push('Preamble: ' + item.preamble)
                        }
                        if (item.flattenedParts) {
                            snippetParts.push('Relevant provisions: ' + item.flattenedParts)
                        }
                        var snippet = snippetParts.join('\n')
                        if (snippet.length > snippetMaxChars) {
                            snippet = snippet.slice(0, snippetMaxChars) + '...'
                        }

                        contextLines.push('[' + label + '] ' + item.type.toUpperCase() + ' | id=' + item.id + ' | title=' + title)
                        if (item.caseNumber) {
                            contextLines.push('[' + label + '] caseNumber: ' + item.caseNumber)
                        }
                        if (item.citation) {
                            contextLines.push('[' + label + '] citation: ' + JSON.stringify(item.citation))
                        }
                        if (item.legislationNumber || item.legislationNumbers) {
                            contextLines.push('[' + label + '] legislation references: ' + (item.legislationNumber || '') + ' ' + (item.legislationNumbers || ''))
                        }
                        if (item.dateOfAssent) {
                            contextLines.push('[' + label + '] dateOfAssent: ' + item.dateOfAssent)
                        }
                        if (item.year) {
                            contextLines.push('[' + label + '] year: ' + item.year)
                        }
                        if (legislationHydration && legislationHydration.heading) {
                            contextLines.push('[' + label + '] clause heading: ' + legislationHydration.heading)
                        }
                        if (snippet) {
                            contextLines.push('[' + label + '] snippet: ' + snippet)
                        }

                        sources.push({
                            source: label,
                            id: item.id,
                            type: item.type,
                            title: title,
                            score: item.score,
                            clauseHeading: legislationHydration ? legislationHydration.heading : undefined,
                            clauseScore: legislationHydration ? legislationHydration.score : undefined
                        })
                    }

                    var systemPrompt =
                        'You are a legal research assistant for Apptorney. ' +
                        'Answer the user question directly and naturally, without meta lead-ins. ' +
                        'Do not start with phrases like "The context provides", "Based on the provided context", ' +
                        '"According to the materials you have provided", or any similar reference to materials being provided. ' +
                        'The legal materials come from the Apptorney platform, not from the user — never imply the user supplied them. ' +
                        'Provide a complete, high-quality answer with practical detail and clear reasoning. ' +
                        'Use only the supplied context for factual claims. ' +
                        'If information is missing, say so briefly in plain language. ' +
                        'Cite sources inline as [S1], [S2]. Do not invent citations.'

                    var userPrompt =
                        'Question:\n' + question.trim() + '\n\n' +
                        'Context:\n' + (contextLines.length ? contextLines.join('\n') : 'No context available.')

                    var maxTokens = parseInt(payload.maxTokens, 10)
                    if (!Number.isFinite(maxTokens) || maxTokens <= 0) {
                        maxTokens = 1200
                    }

                    // --- Open SSE stream ---
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'X-Accel-Buffering': 'no'
                    })

                    var retrievalTimings = retrieval.timings || {}

                    // Send metadata event first
                    sendSSE('metadata', {
                        question: question.trim(),
                        sources: sources,
                        retrieval: {
                            limit: retrieval.limit,
                            queryDimensions: retrieval.queryDimensions,
                            stats: retrieval.stats,
                            timings: retrieval.timings,
                            searchPath: retrieval.searchPath,
                            hydratedLegislations: Object.keys(hydratedMap).length
                        },
                        historyUsedCount: historyMessages.length,
                        latency: {
                            embed_ms: retrievalTimings.embed_ms,
                            search_ms: retrievalTimings.search_ms_total,
                            retrieval_ms: retrievalMs,
                            hydration_ms: hydrationMs
                        }
                    })

                    // Stream OpenAI response
                    var openAiStart = nowMs()
                    console.log('[ask-ai-stream] ' + askAiRequestId + ' openai:start streaming')

                    openaiClient.createStreamingChatCompletion({
                        model: payload.model,
                        temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.1,
                        maxTokens: maxTokens,
                        messages: [{ role: 'system', content: systemPrompt }]
                            .concat(historyMessages)
                            .concat([{ role: 'user', content: userPrompt }])
                    }, {
                        onToken: function (text) {
                            sendSSE('token', { text: text })
                        },
                        onDone: function (aiResponse) {
                            var openAiMs = nowMs() - openAiStart
                            var totalMs = nowMs() - requestStart
                            console.log('[ask-ai-stream] ' + askAiRequestId + ' openai:done ms=' + openAiMs + ' total_ms=' + totalMs)

                            var finalHistory = historyMessages
                                .concat([{ role: 'user', content: question.trim() }])
                                .concat([{ role: 'assistant', content: aiResponse.text }])
                            if (finalHistory.length > MAX_THREAD_MESSAGES) {
                                finalHistory = finalHistory.slice(finalHistory.length - MAX_THREAD_MESSAGES)
                            }

                            var threadTitle = (existingThread && existingThread.title)
                                ? existingThread.title
                                : (typeof payload.title === 'string' && payload.title.trim()
                                    ? payload.title.trim()
                                    : buildThreadTitle(question))

                            // Save thread (non-blocking for the stream)
                            saveChatThread({
                                threadId: existingThread ? existingThread._id : providedThreadId,
                                userId: userId,
                                title: threadTitle,
                                history: finalHistory,
                                lastQuestion: question.trim(),
                                lastAnswer: aiResponse.text,
                                lastModel: aiResponse.model
                            }, function (saveErr, savedThread) {
                                var threadSummary = savedThread ? formatThreadSummary(savedThread) : null
                                if (saveErr) {
                                    console.log('[ask-ai-stream-thread-save-error] ' + saveErr.message)
                                }

                                console.log('[ask-ai-stream-latency] ' + JSON.stringify({
                                    embed_ms: retrievalTimings.embed_ms,
                                    search_ms: retrievalTimings.search_ms_total,
                                    retrieval_ms: retrievalMs,
                                    hydration_ms: hydrationMs,
                                    openai_ms: openAiMs,
                                    total_ms: totalMs
                                }))

                                // Send final done event with complete answer + thread info
                                sendSSE('done', {
                                    answer: aiResponse.text,
                                    model: aiResponse.model,
                                    usage: aiResponse.usage,
                                    thread: threadSummary,
                                    threadSaveError: saveErr ? saveErr.message : null,
                                    latency: {
                                        embed_ms: retrievalTimings.embed_ms,
                                        search_ms: retrievalTimings.search_ms_total,
                                        retrieval_ms: retrievalMs,
                                        hydration_ms: hydrationMs,
                                        openai_ms: openAiMs,
                                        total_ms: totalMs
                                    }
                                })
                                res.end()
                            })
                        },
                        onError: function (err) {
                            console.error('[ask-ai-stream] ' + askAiRequestId + ' openai:error ' + err.message)
                            sendSSE('error', { message: err.message })
                            res.end()
                        }
                    })

                    // Handle client disconnect
                    req.on('close', function () {
                        console.log('[ask-ai-stream] ' + askAiRequestId + ' client disconnected')
                    })
                })
            })
        }

        // Load thread if provided, then run
        if (!providedThreadId) {
            runStreamWithThread(null)
            return
        }

        var threadQuery = { _id: providedThreadId, userId: userId }
        withChatThreadsCollection(function (collectionErr, collection) {
            if (collectionErr) {
                res.status(500).json({ error: collectionErr.message })
                return
            }
            collection.findOne(threadQuery, function (err, threadDoc) {
                if (err) {
                    res.status(500).json({ error: err.message })
                    return
                }
                if (!threadDoc) {
                    res.status(404).json({ error: 'Thread not found' })
                    return
                }
                runStreamWithThread(threadDoc)
            })
        })
    }






}
