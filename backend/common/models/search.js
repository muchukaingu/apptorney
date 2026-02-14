module.exports = function(Search) {
    const { ObjectId } = require('mongodb') // or ObjectID
    const vectorSearch = require('./shared/vector-search')
    const openaiClient = require('./shared/openai-client')

    var KeenTracking = require('keen-tracking')

    // This is your actual Project ID and Write Key
    var keenClient = new KeenTracking({
        projectId: '5aaf4c58c9e77c0001692b2b',
        writeKey: 'A730DDA82E082E47030F8A0C43F0E284BD5F445D9969108D5436E1416660AAE5819502658F77A48C2FDED30A4C9113C19BB5265C73F21713E6ED44AADFF35DF5E71EAB2C2A30EE05332027BF733D7615D1F34D4544F1B3A62FFDFA797A912A61'
    })



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
            accepts: { arg: 'question', type: 'string' },
            returns: { arg: 'response', type: 'Object', root: true }
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
            vectorSearch.resolveQueryVector(payload, function (err, queryVector) {
                if (err) {
                    cb(err)
                    return
                }

                var dataSource = Search.getDataSource().connector
                var caseCollection = dataSource.collection('case')
                var legislationCollection = dataSource.collection('legislation')
                var includeDeleted = payload.includeDeleted === true
                var includeCases = payload.includeCases !== false
                var includeLegislations = payload.includeLegislations !== false
                var limit = vectorSearch.sanitizeLimit(payload.limit)
                var finalResults = []
                var pending = 0
                var stats = {}
                var finished = false

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
                    complete(null, {
                        limit: limit,
                        queryDimensions: queryVector.length,
                        stats: stats,
                        results: finalResults
                    })
                }

                function fail(searchErr) {
                    complete(searchErr)
                }

                if (includeCases) {
                    pending += 1
                    vectorSearch.searchCollection({
                        collection: caseCollection,
                        queryVector: queryVector,
                        embeddingField: 'caseEmbedding',
                        limit: limit,
                        maxCandidates: payload.maxCandidates,
                        match: includeDeleted ? {} : { deleted: { $ne: true } },
                    projection: {
                        caseEmbedding: true,
                        name: true,
                        caseNumber: true,
                        summaryOfRuling: true,
                        summaryOfFacts: true,
                        judgement: true,
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
                            judgement: doc.judgement,
                            citation: doc.citation,
                            year: doc.year
                        }
                    }
                }, function (searchErr, result) {
                        if (searchErr) {
                            fail(searchErr)
                            return
                        }
                        stats.case = { scanned: result.scanned, compared: result.compared }
                        finalResults = finalResults.concat(result.results)
                        doneOne()
                    })
                }

                if (includeLegislations) {
                    pending += 1
                    vectorSearch.searchCollection({
                        collection: legislationCollection,
                        queryVector: queryVector,
                        embeddingField: 'legislationEmbedding',
                        limit: limit,
                        maxCandidates: payload.maxCandidates,
                        match: includeDeleted ? {} : { deleted: { $ne: true } },
                    projection: {
                        legislationEmbedding: true,
                        legislationName: true,
                        legislationNumber: true,
                        legislationNumbers: true,
                        preamble: true,
                        flattenedParts: true,
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
                            flattenedParts: doc.flattenedParts,
                            dateOfAssent: doc.dateOfAssent,
                            year: doc.year
                        }
                    }
                }, function (searchErr, result) {
                        if (searchErr) {
                            fail(searchErr)
                            return
                        }
                        stats.legislation = { scanned: result.scanned, compared: result.compared }
                        finalResults = finalResults.concat(result.results)
                        doneOne()
                    })
                }

                if (pending === 0) {
                    complete(new Error('At least one of includeCases/includeLegislations must be true'))
                }
            })
        } catch (err) {
            cb(err)
        }
    }

    Search.askAi = function (payload, cb) {
     
        console.log("ask-ai payload:", payload);

        var question = payload
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            cb(new Error('question is required (send JSON body with question, queryText, message, prompt, or text)'))
            return
        }

        var retrievalLimit = parseInt(payload.retrievalLimit, 10)
        if (!Number.isFinite(retrievalLimit) || retrievalLimit <= 0) {
            retrievalLimit = 12
        }
        retrievalLimit = Math.min(retrievalLimit, 30)

        Search.universalVectorSearch({
            queryText: question,
            queryVector: payload.queryVector,
            limit: retrievalLimit,
            maxCandidates: payload.maxCandidates,
            includeCases: payload.includeCases,
            includeLegislations: payload.includeLegislations,
            includeDeleted: payload.includeDeleted === true
        }, function (retrievalErr, retrieval) {
            if (retrievalErr) {
                cb(retrievalErr)
                return
            }

            var results = retrieval.results || []
            var contextLines = []
            var sources = []
            var maxContextItems = Math.min(results.length, retrievalLimit)

            for (var i = 0; i < maxContextItems; i += 1) {
                var item = results[i]
                var label = 'S' + (i + 1)
                var title = item.type === 'case'
                    ? (item.name || 'Untitled case')
                    : (item.legislationName || 'Untitled legislation')
                var snippetParts = []
                if (item.summaryOfRuling) {
                    snippetParts.push('Summary of ruling: ' + item.summaryOfRuling)
                }
                if (item.summaryOfFacts) {
                    snippetParts.push('Summary of facts: ' + item.summaryOfFacts)
                }
                if (item.judgement) {
                    snippetParts.push('Judgment: ' + item.judgement)
                }
                if (item.preamble) {
                    snippetParts.push('Preamble: ' + item.preamble)
                }
                if (item.flattenedParts) {
                    snippetParts.push('Relevant provisions: ' + item.flattenedParts)
                }
                var snippet = snippetParts.join('\n')
                if (snippet.length > 2600) {
                    snippet = snippet.slice(0, 2600) + '...'
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
                if (snippet) {
                    contextLines.push('[' + label + '] snippet: ' + snippet)
                }

                sources.push({
                    source: label,
                    id: item.id,
                    type: item.type,
                    title: title,
                    score: item.score
                })
            }

            var systemPrompt =
                'You are a legal research assistant for Apptorney. ' +
                'Answer the user question directly and naturally, without meta lead-ins. ' +
                'Do not start with phrases like "The context provides" or "Based on the provided context". ' +
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

            openaiClient.createChatCompletion({
                model: payload.model,
                temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.1,
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

                cb(null, {
                    question: question.trim(),
                    answer: aiResponse.text,
                    model: aiResponse.model,
                    usage: aiResponse.usage,
                    sources: sources,
                    retrieval: {
                        limit: retrieval.limit,
                        queryDimensions: retrieval.queryDimensions,
                        stats: retrieval.stats
                    }
                })
            })
        })
    }








}
