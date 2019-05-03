module.exports = function(Search) {
    const { ObjectId } = require('mongodb') // or ObjectID

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

    Search.mobilesearch = function(term, cb) {
        var elasticsearch = require('elasticsearch')
        let client = new elasticsearch.Client({
            host: 'https://portal-ssl840-69.bmix-eu-gb-yp-97013c6e-fa76-4cf9-8294-dd6528359b56.3432409090.composedb.com:17336/',
            httpAuth: 'admin:SCORWHBESUMVUDLL'
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
                if (h._source.judgement == undefined &&
                    h._source.summaryOfFacts == undefined &&
                    h._source.summaryOfRuling == undefined
                ) {
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
                } else {
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
            });
            keenClient.recordEvent('caseSearches', {
                term: term
            });

            cb(null, results)
        }, function(err) {
            throw new Error(err)
        })
    }








}