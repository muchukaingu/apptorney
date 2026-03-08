'use strict'

var jwtHelper = require('../../common/models/shared/jwt')
var mongodb = require('mongodb')
var ObjectId = mongodb.ObjectId

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'

    function requireAdmin(req, res, next) {
        var authHeader = req.headers && (req.headers.authorization || req.headers.Authorization)
        var token = ''
        if (typeof authHeader === 'string') {
            var match = authHeader.match(/^Bearer\s+(.+)$/i)
            if (match && match[1]) token = match[1].trim()
        }

        if (!token) {
            return sendError(res, 401, 'Authentication required')
        }

        var decoded = jwtHelper.verifyAccessToken(token)
        if (!decoded) {
            return sendError(res, 401, 'Invalid or expired token')
        }

        var Appuser = app.models.appuser || app.models.Appuser
        Appuser.findById(decoded.sub, function (err, user) {
            if (err) return next(err)
            if (!user) {
                return sendError(res, 401, 'User not found')
            }
            if (user.role !== 'admin') {
                return sendError(res, 403, 'Admin access required')
            }
            req.adminUser = user
            next()
        })
    }

    function sendError(res, statusCode, message, details) {
        var payload = {
            error: {
                statusCode: statusCode,
                message: message
            }
        }

        if (details) {
            payload.error.details = details
        }

        res.status(statusCode).json(payload)
    }

    function hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj || {}, key)
    }

    function toTrimmedString(value) {
        return value == null ? '' : String(value).trim()
    }

    function normalizeId(value) {
        if (value == null) {
            return ''
        }
        if (typeof value === 'string') {
            return value
        }
        if (value && typeof value.toHexString === 'function') {
            return value.toHexString()
        }
        if (value && typeof value.toString === 'function') {
            return value.toString()
        }
        return String(value)
    }

    function normalizeDate(value) {
        if (!value) {
            return ''
        }
        var date = new Date(value)
        if (isNaN(date.getTime())) {
            return ''
        }
        return date.toISOString()
    }

    function parsePositiveInt(value, fallback, max) {
        var parsed = parseInt(value, 10)
        if (!isFinite(parsed) || parsed < 1) {
            return fallback
        }
        if (max && parsed > max) {
            return max
        }
        return parsed
    }

    function parseOptionalNumber(value) {
        if (value === '' || value == null) {
            return null
        }
        var parsed = Number(value)
        return isFinite(parsed) ? parsed : null
    }

    function parseOptionalBoolean(value) {
        if (value === '' || value == null || value === 'all') {
            return null
        }
        if (value === true || value === 'true' || value === '1' || value === 1) {
            return true
        }
        if (value === false || value === 'false' || value === '0' || value === 0) {
            return false
        }
        return null
    }

    function toObjectId(value) {
        var clean = toTrimmedString(value)
        if (!clean) {
            return null
        }
        if (!ObjectId.isValid(clean)) {
            return null
        }
        return new ObjectId(clean)
    }

    function escapeRegex(value) {
        return toTrimmedString(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    function buildRegex(value) {
        var clean = toTrimmedString(value)
        return clean ? new RegExp(escapeRegex(clean), 'i') : null
    }

    function getCollection(model) {
        return model.getDataSource().connector.collection(model.modelName)
    }

    function toPlainObject(instance) {
        if (!instance) {
            return null
        }
        if (typeof instance.toJSON === 'function') {
            return instance.toJSON()
        }
        return instance
    }

    function normalizeCaseCitation(caseDoc) {
        var citation = caseDoc && caseDoc.citation ? caseDoc.citation : {}
        if (toTrimmedString(caseDoc && caseDoc.caseNumber)) {
            return toTrimmedString(caseDoc.caseNumber)
        }
        return [
            citation.year,
            toTrimmedString(citation.code),
            citation.pageNumber
        ].filter(function (part) { return part !== '' && part != null; }).join(' / ')
    }

    function normalizePartyList(items) {
        if (!Array.isArray(items)) {
            return []
        }

        return items
            .map(function (item) {
                return {
                    name: toTrimmedString(item && item.name)
                }
            })
            .filter(function (item) {
                return !!item.name
            })
    }

    function normalizeCitation(citation) {
        if (!citation) {
            return null
        }

        var normalized = {
            description: toTrimmedString(citation.description),
            number: toTrimmedString(citation.number),
            year: parseOptionalNumber(citation.year),
            code: toTrimmedString(citation.code),
            pageNumber: parseOptionalNumber(citation.pageNumber)
        }

        if (!normalized.description && !normalized.number && normalized.year == null && !normalized.code && normalized.pageNumber == null) {
            return null
        }

        return normalized
    }

    function normalizeCaseDocument(caseDoc) {
        var doc = toPlainObject(caseDoc) || {}
        var citation = normalizeCitation(doc.citation)

        return {
            id: normalizeId(doc.id || doc._id),
            name: toTrimmedString(doc.name),
            caseNumber: toTrimmedString(doc.caseNumber),
            appealNumber: toTrimmedString(doc.appealNumber),
            courtId: normalizeId(doc.courtId || doc.court),
            areaOfLawId: normalizeId(doc.areaOfLawId),
            courtName: toTrimmedString(doc.court && doc.court.name),
            areaOfLawName: toTrimmedString(doc.areaOfLaw && doc.areaOfLaw.name),
            citation: citation,
            citationLabel: normalizeCaseCitation(doc),
            plaintiffs: normalizePartyList(doc.plaintiffs),
            defendants: normalizePartyList(doc.defendants),
            summaryOfFacts: toTrimmedString(doc.summaryOfFacts),
            summaryOfRuling: toTrimmedString(doc.summaryOfRuling),
            judgement: toTrimmedString(doc.judgement),
            notes: toTrimmedString(doc.notes),
            completionStatus: !!doc.completionStatus,
            primaryReview: !!doc.primaryReview,
            secondayReview: !!doc.secondayReview,
            isStub: !!doc.isStub,
            reported: !!doc.reported,
            createdAt: normalizeDate(doc.createdAt),
            updatedAt: normalizeDate(doc.updatedAt)
        }
    }

    function normalizeLegislationDocument(legislationDoc) {
        var doc = toPlainObject(legislationDoc) || {}

        return {
            id: normalizeId(doc.id || doc._id),
            legislationName: toTrimmedString(doc.legislationName),
            generalTitle: toTrimmedString(doc.generalTitle),
            chapterNumber: toTrimmedString(doc.chapterNumber),
            legislationNumber: toTrimmedString(doc.legislationNumber),
            legislationNumbers: toTrimmedString(doc.legislationNumbers),
            dateOfAssent: normalizeDate(doc.dateOfAssent),
            preamble: toTrimmedString(doc.preamble),
            enactment: toTrimmedString(doc.enactment),
            yearOfAmendment: parseOptionalNumber(doc.yearOfAmendment),
            volumeNumber: toTrimmedString(doc.volumeNumber),
            legislationTypeId: normalizeId(doc.legislationType),
            legislationTypeName: toTrimmedString(doc.legislationTypeName),
            deleted: !!doc.deleted,
            createdAt: normalizeDate(doc.createdAt),
            updatedAt: normalizeDate(doc.updatedAt)
        }
    }

    function sanitizeCasePayload(payload, isCreate) {
        payload = payload || {}

        var record = {}
        var errors = []

        function assignString(field) {
            if (hasOwn(payload, field)) {
                record[field] = toTrimmedString(payload[field])
            }
        }

        function assignBoolean(field) {
            if (hasOwn(payload, field)) {
                record[field] = !!payload[field]
            }
        }

        function assignObjectId(field, label) {
            if (!hasOwn(payload, field)) {
                return
            }

            var raw = payload[field]
            if (raw === '' || raw == null) {
                record[field] = null
                return
            }

            var objectId = toObjectId(raw)
            if (!objectId) {
                errors.push(label + ' is invalid.')
                return
            }

            record[field] = objectId
        }

        assignString('name')
        assignString('caseNumber')
        assignString('appealNumber')
        assignString('summaryOfFacts')
        assignString('summaryOfRuling')
        assignString('judgement')
        assignString('notes')

        assignBoolean('completionStatus')
        assignBoolean('primaryReview')
        assignBoolean('secondayReview')
        assignBoolean('isStub')
        assignBoolean('reported')

        assignObjectId('courtId', 'Court')
        assignObjectId('areaOfLawId', 'Area of law')
        assignObjectId('courtDivisionId', 'Court division')
        assignObjectId('locationId', 'Location')
        assignObjectId('jurisdictionId', 'Jurisdiction')

        if (hasOwn(payload, 'plaintiffs')) {
            if (!Array.isArray(payload.plaintiffs)) {
                errors.push('Plaintiffs must be a list.')
            } else {
                record.plaintiffs = normalizePartyList(payload.plaintiffs)
            }
        }

        if (hasOwn(payload, 'defendants')) {
            if (!Array.isArray(payload.defendants)) {
                errors.push('Defendants must be a list.')
            } else {
                record.defendants = normalizePartyList(payload.defendants)
            }
        }

        if (hasOwn(payload, 'citation')) {
            if (payload.citation == null) {
                record.citation = null
            } else if (typeof payload.citation !== 'object') {
                errors.push('Citation must be an object.')
            } else {
                var citation = normalizeCitation(payload.citation)

                if (!citation) {
                    record.citation = null
                } else {
                    if (!citation.description) {
                        errors.push('Citation description is required.')
                    }
                    if (citation.year == null) {
                        errors.push('Citation year is required.')
                    }
                    if (!citation.code) {
                        errors.push('Citation code is required.')
                    }
                    if (citation.pageNumber == null) {
                        errors.push('Citation page number is required.')
                    }

                    record.citation = citation
                }
            }
        }

        if (isCreate && !toTrimmedString(record.name) && !toTrimmedString(record.caseNumber)) {
            errors.push('Provide at least a case name or case number.')
        }

        return { record: record, errors: errors }
    }

    function sanitizeLegislationPayload(payload, isCreate) {
        payload = payload || {}

        var record = {}
        var errors = []

        function assignString(field) {
            if (hasOwn(payload, field)) {
                record[field] = toTrimmedString(payload[field])
            }
        }

        assignString('generalTitle')
        assignString('chapterNumber')
        assignString('legislationName')
        assignString('legislationNumber')
        assignString('legislationNumbers')
        assignString('preamble')
        assignString('enactment')
        assignString('volumeNumber')

        if (hasOwn(payload, 'dateOfAssent')) {
            var dateValue = toTrimmedString(payload.dateOfAssent)
            if (!dateValue) {
                record.dateOfAssent = null
            } else {
                var parsedDate = new Date(dateValue)
                if (isNaN(parsedDate.getTime())) {
                    errors.push('Date of assent is invalid.')
                } else {
                    record.dateOfAssent = parsedDate
                }
            }
        }

        if (hasOwn(payload, 'yearOfAmendment')) {
            if (payload.yearOfAmendment === '' || payload.yearOfAmendment == null) {
                record.yearOfAmendment = null
            } else {
                var yearOfAmendment = parseInt(payload.yearOfAmendment, 10)
                if (!isFinite(yearOfAmendment)) {
                    errors.push('Year of amendment must be a number.')
                } else {
                    record.yearOfAmendment = yearOfAmendment
                }
            }
        }

        if (hasOwn(payload, 'deleted')) {
            record.deleted = !!payload.deleted
        }

        if (hasOwn(payload, 'legislationTypeId')) {
            var typeValue = payload.legislationTypeId
            if (typeValue === '' || typeValue == null) {
                record.legislationType = null
            } else {
                var legislationTypeId = toObjectId(typeValue)
                if (!legislationTypeId) {
                    errors.push('Legislation type is invalid.')
                } else {
                    record.legislationType = legislationTypeId
                }
            }
        }

        if (hasOwn(payload, 'legislationType')) {
            var rawTypeValue = payload.legislationType
            if (rawTypeValue === '' || rawTypeValue == null) {
                record.legislationType = null
            } else {
                var rawLegislationTypeId = toObjectId(rawTypeValue)
                if (!rawLegislationTypeId) {
                    errors.push('Legislation type is invalid.')
                } else {
                    record.legislationType = rawLegislationTypeId
                }
            }
        }

        if ((isCreate || hasOwn(payload, 'legislationName')) && !toTrimmedString(record.legislationName)) {
            errors.push('Legislation name is required.')
        }

        return { record: record, errors: errors }
    }

    function buildCaseMatch(query) {
        var and = [{ deleted: { $ne: true } }]
        var searchTerm = toTrimmedString(query.search || query.query)
        var searchRegex = buildRegex(searchTerm)
        var courtId = toObjectId(query.courtId)
        var areaOfLawId = toObjectId(query.areaOfLawId)
        var year = parseOptionalNumber(query.year)
        var completionStatus = parseOptionalBoolean(query.completionStatus)
        var primaryReview = parseOptionalBoolean(query.primaryReview)
        var isStub = parseOptionalBoolean(query.isStub)

        if (searchRegex) {
            var searchConditions = [
                { name: searchRegex },
                { caseNumber: searchRegex },
                { appealNumber: searchRegex },
                { 'citation.code': searchRegex },
                { 'citation.description': searchRegex },
                { 'citation.number': searchRegex }
            ]

            var numericSearch = parseInt(searchTerm, 10)
            if (isFinite(numericSearch)) {
                searchConditions.push({ 'citation.year': numericSearch })
                searchConditions.push({ 'citation.pageNumber': numericSearch })
            }

            and.push({ $or: searchConditions })
        }

        if (courtId) {
            and.push({ courtId: courtId })
        }

        if (areaOfLawId) {
            and.push({ areaOfLawId: areaOfLawId })
        }

        if (year != null) {
            and.push({
                $or: [
                    { 'citation.year': year },
                    { year: year }
                ]
            })
        }

        if (completionStatus != null) {
            and.push({ completionStatus: completionStatus })
        }

        if (primaryReview != null) {
            and.push({ primaryReview: primaryReview })
        }

        if (isStub != null) {
            and.push({ isStub: isStub })
        }

        return and.length === 1 ? and[0] : { $and: and }
    }

    function buildLegislationMatch(query) {
        var and = []
        var deletedState = toTrimmedString(query.deletedState || 'active').toLowerCase()
        var searchRegex = buildRegex(query.search || query.query)
        var typeId = toObjectId(query.legislationTypeId || query.legislationType)
        var assentYear = parseOptionalNumber(query.assentYear)
        var hasAmendment = parseOptionalBoolean(query.hasAmendment)

        if (deletedState === 'deleted') {
            and.push({ deleted: true })
        } else if (deletedState !== 'all') {
            and.push({ deleted: { $ne: true } })
        }

        if (searchRegex) {
            and.push({
                $or: [
                    { legislationName: searchRegex },
                    { generalTitle: searchRegex },
                    { legislationNumber: searchRegex },
                    { legislationNumbers: searchRegex },
                    { preamble: searchRegex }
                ]
            })
        }

        if (typeId) {
            and.push({ legislationType: typeId })
        }

        if (assentYear != null) {
            and.push({
                dateOfAssent: {
                    $gte: new Date(assentYear, 0, 1),
                    $lt: new Date(assentYear + 1, 0, 1)
                }
            })
        }

        if (hasAmendment === true) {
            and.push({ yearOfAmendment: { $ne: null } })
        } else if (hasAmendment === false) {
            and.push({
                $or: [
                    { yearOfAmendment: null },
                    { yearOfAmendment: { $exists: false } }
                ]
            })
        }

        return and.length ? { $and: and } : {}
    }

    function normalizeCaseListItem(doc) {
        var citation = doc && doc.citation ? doc.citation : {}
        var citationLabel = [
            toTrimmedString(doc.caseNumber),
            [citation.year, toTrimmedString(citation.code), citation.pageNumber].filter(function (part) {
                return part !== '' && part != null
            }).join(' / ')
        ].filter(function (part) { return !!part }).shift() || ''

        return {
            id: normalizeId(doc._id),
            name: toTrimmedString(doc.name),
            caseNumber: toTrimmedString(doc.caseNumber),
            appealNumber: toTrimmedString(doc.appealNumber),
            citationLabel: citationLabel,
            courtId: normalizeId(doc.courtId),
            courtName: toTrimmedString(doc.courtInfo && doc.courtInfo.name),
            areaOfLawId: normalizeId(doc.areaOfLawId),
            areaOfLawName: toTrimmedString(doc.areaInfo && doc.areaInfo.name),
            completionStatus: !!doc.completionStatus,
            primaryReview: !!doc.primaryReview,
            isStub: !!doc.isStub,
            reported: !!doc.reported,
            createdAt: normalizeDate(doc.createdAt),
            updatedAt: normalizeDate(doc.updatedAt)
        }
    }

    function normalizeLegislationListItem(doc) {
        return {
            id: normalizeId(doc._id),
            legislationName: toTrimmedString(doc.legislationName),
            generalTitle: toTrimmedString(doc.generalTitle),
            chapterNumber: toTrimmedString(doc.chapterNumber),
            legislationNumber: toTrimmedString(doc.legislationNumber),
            legislationNumbers: toTrimmedString(doc.legislationNumbers),
            legislationTypeId: normalizeId(doc.legislationType),
            legislationTypeName: toTrimmedString(doc.legislationTypeInfo && doc.legislationTypeInfo.name),
            volumeNumber: toTrimmedString(doc.volumeNumber),
            yearOfAmendment: parseOptionalNumber(doc.yearOfAmendment),
            dateOfAssent: normalizeDate(doc.dateOfAssent),
            deleted: !!doc.deleted,
            createdAt: normalizeDate(doc.createdAt),
            updatedAt: normalizeDate(doc.updatedAt)
        }
    }

    function getRecentMaterialItems(caseModel, legislationModel, cb) {
        var items = []
        var pending = 2
        var done = false

        function finish(err) {
            if (done) {
                return
            }

            if (err) {
                done = true
                cb(err)
                return
            }

            pending--
            if (pending === 0) {
                done = true
                items.sort(function (left, right) {
                    return new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime()
                })
                cb(null, items.slice(0, 6))
            }
        }

        getCollection(caseModel)
            .find({ deleted: { $ne: true } }, { projection: { name: true } })
            .sort({ _id: -1 })
            .limit(4)
            .toArray(function (err, docs) {
                if (err) return finish(err)

                items = items.concat((docs || []).map(function (doc) {
                    var addedAt = doc && doc._id && typeof doc._id.getTimestamp === 'function'
                        ? doc._id.getTimestamp()
                        : null

                    return {
                        type: 'Case',
                        title: toTrimmedString(doc.name) || 'Untitled case',
                        addedAt: normalizeDate(addedAt),
                        id: normalizeId(doc._id)
                    }
                }))

                finish(null)
            })

        getCollection(legislationModel)
            .find({ deleted: { $ne: true } }, { projection: { legislationName: true } })
            .sort({ _id: -1 })
            .limit(4)
            .toArray(function (err, docs) {
                if (err) return finish(err)

                items = items.concat((docs || []).map(function (doc) {
                    var addedAt = doc && doc._id && typeof doc._id.getTimestamp === 'function'
                        ? doc._id.getTimestamp()
                        : null

                    return {
                        type: 'Legislation',
                        title: toTrimmedString(doc.legislationName) || 'Untitled legislation',
                        addedAt: normalizeDate(addedAt),
                        id: normalizeId(doc._id)
                    }
                }))

                finish(null)
            })
    }

    app.get(restRoot + '/admin/stats/overview', requireAdmin, function (req, res, next) {
        var Appuser = app.models.appuser || app.models.Appuser
        var Case = app.models.case || app.models.Case
        var Legislation = app.models.legislation || app.models.Legislation
        var Subscription = app.models.subscription || app.models.Subscription
        var Payment = app.models.payment || app.models.Payment
        var Organization = app.models.Organization
        var DailyStats = app.models.DailyStats

        var now = new Date()
        var today = new Date(now)
        today.setHours(0, 0, 0, 0)
        var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        var thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        var result = {
            users: {},
            content: {},
            subscriptions: {},
            revenue: {},
            organizations: {},
            ai: {}
        }

        var pending = 0
        var finished = 0
        var sent = false

        var safetyTimer = setTimeout(function () {
            if (!sent) {
                sent = true
                res.json(result)
            }
        }, 55000)

        function track(fn) {
            pending++
            fn(function (err) {
                if (err) {
                    console.log('Overview stat error:', err.message)
                }
                finished++
                if (!sent && finished === pending) {
                    sent = true
                    clearTimeout(safetyTimer)
                    res.json(result)
                }
            })
        }

        track(function (cb) {
            Appuser.count({}, function (err, count) {
                result.users.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Appuser.count({ lastLogin: { gte: thirtyDaysAgo } }, function (err, count) {
                result.users.active = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Appuser.count({ createdAt: { gte: today } }, function (err, count) {
                result.users.newToday = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Appuser.count({ createdAt: { gte: startOfMonth } }, function (err, count) {
                result.users.newThisMonth = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({}, function (err, count) {
                result.content.totalCases = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: true }, function (err, count) {
                result.content.completeCases = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: { neq: true } }, function (err, count) {
                result.content.incompleteCases = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Legislation.count({ deleted: { neq: true } }, function (err, count) {
                result.content.totalLegislation = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({}, function (err, count) {
                result.subscriptions.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'active' }, function (err, count) {
                result.subscriptions.active = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'expired' }, function (err, count) {
                result.subscriptions.expired = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'cancelled' }, function (err, count) {
                result.subscriptions.cancelled = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'pending' }, function (err, count) {
                result.subscriptions.pending = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Payment.find({ where: { status: 'confirmed' }, fields: { amount: true } }, function (err, payments) {
                result.revenue.total = 0
                for (var i = 0; i < (payments || []).length; i++) {
                    result.revenue.total += payments[i].amount || 0
                }
                cb(err)
            })
        })

        track(function (cb) {
            Payment.find({
                where: { status: 'confirmed', date: { gte: startOfMonth } },
                fields: { amount: true }
            }, function (err, payments) {
                result.revenue.thisMonth = 0
                for (var i = 0; i < (payments || []).length; i++) {
                    result.revenue.thisMonth += payments[i].amount || 0
                }
                cb(err)
            })
        })

        track(function (cb) {
            Organization.count({}, function (err, count) {
                result.organizations.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            DailyStats.findOne({ where: { snapshotDate: today } }, function (err, stats) {
                result.ai.queriesToday = (stats && stats.aiQueries) || 0
                cb(err)
            })
        })
    })

    app.get(restRoot + '/admin/stats/growth', requireAdmin, function (req, res, next) {
        var DailyStats = app.models.DailyStats
        var period = req.query.period || '30d'

        var now = new Date()
        var since

        if (period === '90d') {
            since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        } else if (period === '1y') {
            since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        } else if (period === 'all') {
            since = new Date(0)
        } else if (period === '30d') {
            since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        } else {
            return sendError(res, 400, 'Invalid period. Use 30d, 90d, 1y, or all.')
        }

        DailyStats.find({
            where: { snapshotDate: { gte: since } },
            order: 'snapshotDate ASC'
        }, function (err, snapshots) {
            if (err) return next(err)

            var dataPoints = []
            for (var i = 0; i < snapshots.length; i++) {
                var snapshot = snapshots[i]
                dataPoints.push({
                    date: snapshot.snapshotDate,
                    totalUsers: snapshot.totalUsers || 0,
                    newUsers: snapshot.newUsers || 0,
                    activeUsers: snapshot.activeUsers || 0,
                    activeSubscriptions: snapshot.activeSubscriptions || 0,
                    newSubscriptions: snapshot.newSubscriptions || 0,
                    churnedSubscriptions: snapshot.churnedSubscriptions || 0,
                    totalRevenue: snapshot.totalRevenue || 0,
                    dailyRevenue: snapshot.dailyRevenue || 0,
                    aiQueries: snapshot.aiQueries || 0
                })
            }

            res.json({ period: period, dataPoints: dataPoints })
        })
    })

    app.get(restRoot + '/admin/stats/subscriptions', requireAdmin, function (req, res, next) {
        var Subscription = app.models.subscription || app.models.Subscription

        Subscription.find({ fields: { plan: true, billingPeriod: true, status: true, type: true } }, function (err, subs) {
            if (err) return next(err)

            var byPlan = {}
            var byBillingPeriod = {}
            var byStatus = {}
            var byType = {}

            for (var i = 0; i < subs.length; i++) {
                var subscription = subs[i]
                byPlan[subscription.plan] = (byPlan[subscription.plan] || 0) + 1
                byBillingPeriod[subscription.billingPeriod] = (byBillingPeriod[subscription.billingPeriod] || 0) + 1
                byStatus[subscription.status] = (byStatus[subscription.status] || 0) + 1
                byType[subscription.type] = (byType[subscription.type] || 0) + 1
            }

            res.json({
                byPlan: byPlan,
                byBillingPeriod: byBillingPeriod,
                byStatus: byStatus,
                byType: byType
            })
        })
    })

    app.get(restRoot + '/admin/stats/payments', requireAdmin, function (req, res, next) {
        var Payment = app.models.payment || app.models.Payment
        var page = parsePositiveInt(req.query.page, 1, 5000)
        var limit = parsePositiveInt(req.query.limit, 20, 100)
        var skip = (page - 1) * limit

        var now = new Date()
        var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        var startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        var result = {
            byStatus: {},
            recentPayments: [],
            totalRevenue: 0,
            revenueThisMonth: 0,
            revenueLastMonth: 0,
            total: 0,
            page: page,
            limit: limit,
            pages: 0
        }

        var pending = 3
        var sent = false

        function done(err) {
            if (sent) {
                return
            }

            if (err) {
                sent = true
                return next(err)
            }

            pending--
            if (pending === 0) {
                result.pages = result.total > 0 ? Math.ceil(result.total / limit) : 1
                sent = true
                res.json(result)
            }
        }

        Payment.find({
            fields: { status: true, amount: true, date: true }
        }, function (err, payments) {
            if (err) return done(err)

            for (var i = 0; i < payments.length; i++) {
                var payment = payments[i]
                var status = payment.status || 'unknown'
                result.byStatus[status] = (result.byStatus[status] || 0) + 1

                if (status === 'confirmed') {
                    result.totalRevenue += payment.amount || 0

                    var paymentDate = new Date(payment.date)
                    if (paymentDate >= startOfMonth) {
                        result.revenueThisMonth += payment.amount || 0
                    } else if (paymentDate >= startOfLastMonth && paymentDate < startOfMonth) {
                        result.revenueLastMonth += payment.amount || 0
                    }
                }
            }

            done(null)
        })

        Payment.count({}, function (err, count) {
            if (err) return done(err)
            result.total = count || 0
            done(null)
        })

        Payment.find({
            order: 'date DESC',
            limit: limit,
            skip: skip,
            fields: {
                id: true,
                date: true,
                amount: true,
                method: true,
                status: true,
                reference: true,
                subscriptionId: true,
                paidById: true
            }
        }, function (err, recent) {
            if (err) return done(err)

            result.recentPayments = (recent || []).map(function (payment) {
                return {
                    id: normalizeId(payment.id),
                    date: payment.date,
                    amount: payment.amount,
                    method: payment.method,
                    status: payment.status,
                    reference: payment.reference,
                    subscriptionId: normalizeId(payment.subscriptionId),
                    paidById: normalizeId(payment.paidById)
                }
            })

            done(null)
        })
    })

    app.get(restRoot + '/admin/stats/content', requireAdmin, function (req, res, next) {
        var Case = app.models.case || app.models.Case
        var Legislation = app.models.legislation || app.models.Legislation
        var Court = app.models.court || app.models.Court
        var AreaOfLaw = app.models.areaOfLaw || app.models.AreaOfLaw

        var result = { cases: {}, legislation: {}, recentlyAdded: [] }
        var pending = 0
        var finished = 0
        var sent = false

        var safetyTimer = setTimeout(function () {
            if (!sent) {
                sent = true
                res.json(result)
            }
        }, 55000)

        function track(fn) {
            pending++
            fn(function (err) {
                if (err) {
                    console.log('Content stat error:', err.message)
                }
                finished++
                if (!sent && finished === pending) {
                    sent = true
                    clearTimeout(safetyTimer)
                    res.json(result)
                }
            })
        }

        track(function (cb) {
            Case.count({}, function (err, count) {
                result.cases.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: true }, function (err, count) {
                result.cases.complete = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: { neq: true } }, function (err, count) {
                result.cases.incomplete = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ primaryReview: true }, function (err, count) {
                result.cases.verified = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ isStub: true }, function (err, count) {
                result.cases.stubs = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            getCollection(Case).aggregate([
                { $match: { courtId: { $exists: true, $ne: null } } },
                { $group: { _id: '$courtId', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray(function (err, groups) {
                if (err) return cb(err)

                if (!groups || groups.length === 0) {
                    result.cases.byCourt = []
                    return cb(null)
                }

                var courtIds = groups.map(function (group) { return group._id })
                Court.find({ where: { id: { inq: courtIds } } }, function (courtErr, courts) {
                    if (courtErr) return cb(courtErr)

                    var courtMap = {}
                    for (var i = 0; i < courts.length; i++) {
                        courtMap[normalizeId(courts[i].id)] = courts[i].name
                    }

                    result.cases.byCourt = groups.map(function (group) {
                        return {
                            name: courtMap[normalizeId(group._id)] || 'Unknown',
                            count: group.count
                        }
                    })

                    cb(null)
                })
            })
        })

        track(function (cb) {
            getCollection(Case).aggregate([
                { $match: { areasOfLawIds: { $exists: true, $ne: [] } } },
                { $unwind: '$areasOfLawIds' },
                { $group: { _id: '$areasOfLawIds', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray(function (err, groups) {
                if (err) return cb(err)

                if (!groups || groups.length === 0) {
                    result.cases.byAreaOfLaw = []
                    return cb(null)
                }

                var areaIds = groups.map(function (group) { return group._id })
                AreaOfLaw.find({ where: { id: { inq: areaIds } } }, function (areaErr, areas) {
                    if (areaErr) return cb(areaErr)

                    var areaMap = {}
                    for (var i = 0; i < areas.length; i++) {
                        areaMap[normalizeId(areas[i].id)] = areas[i].name
                    }

                    result.cases.byAreaOfLaw = groups.map(function (group) {
                        return {
                            name: areaMap[normalizeId(group._id)] || 'Unknown',
                            count: group.count
                        }
                    })

                    cb(null)
                })
            })
        })

        track(function (cb) {
            Legislation.count({ deleted: { neq: true } }, function (err, count) {
                result.legislation.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            getCollection(Legislation).aggregate([
                { $match: { deleted: { $ne: true }, legislationType: { $exists: true, $nin: [null, ''] } } },
                { $lookup: { from: 'legislationType', localField: 'legislationType', foreignField: '_id', as: 'typeInfo' } },
                { $unwind: { path: '$typeInfo', preserveNullAndEmptyArrays: true } },
                { $group: { _id: '$typeInfo.name', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray(function (err, groups) {
                if (err) return cb(err)

                result.legislation.byType = (groups || []).map(function (group) {
                    return {
                        name: group._id || 'Unknown',
                        count: group.count
                    }
                })

                cb(null)
            })
        })

        track(function (cb) {
            getRecentMaterialItems(Case, Legislation, function (err, items) {
                if (err) return cb(err)
                result.recentlyAdded = items
                cb(null)
            })
        })
    })

    app.get(restRoot + '/admin/materials/meta', requireAdmin, function (req, res, next) {
        var Court = app.models.court || app.models.Court
        var AreaOfLaw = app.models.areaOfLaw || app.models.AreaOfLaw
        var LegislationType = app.models.legislationType || app.models.LegislationType

        var response = {
            cases: {
                courts: [],
                areasOfLaw: []
            },
            legislations: {
                types: []
            }
        }

        var pending = 3
        var sent = false

        function done(err) {
            if (sent) {
                return
            }

            if (err) {
                sent = true
                return next(err)
            }

            pending--
            if (pending === 0) {
                sent = true
                res.json(response)
            }
        }

        Court.find({
            order: 'name ASC',
            fields: { id: true, name: true }
        }, function (err, courts) {
            if (err) return done(err)
            response.cases.courts = (courts || []).map(function (court) {
                return { id: normalizeId(court.id), name: toTrimmedString(court.name) }
            })
            done(null)
        })

        AreaOfLaw.find({
            order: 'name ASC',
            fields: { id: true, name: true }
        }, function (err, areas) {
            if (err) return done(err)
            response.cases.areasOfLaw = (areas || []).map(function (area) {
                return { id: normalizeId(area.id), name: toTrimmedString(area.name) }
            })
            done(null)
        })

        LegislationType.find({
            order: 'name ASC',
            fields: { id: true, name: true }
        }, function (err, types) {
            if (err) return done(err)
            response.legislations.types = (types || []).map(function (type) {
                return { id: normalizeId(type.id), name: toTrimmedString(type.name) }
            })
            done(null)
        })
    })

    app.get(restRoot + '/admin/materials/cases', requireAdmin, function (req, res, next) {
        if (req.query.courtId && !toObjectId(req.query.courtId)) {
            return sendError(res, 400, 'Court filter is invalid.')
        }
        if (req.query.areaOfLawId && !toObjectId(req.query.areaOfLawId)) {
            return sendError(res, 400, 'Area of law filter is invalid.')
        }

        var Case = app.models.case || app.models.Case
        var page = parsePositiveInt(req.query.page, 1, 5000)
        var limit = parsePositiveInt(req.query.limit, 20, 100)
        var skip = (page - 1) * limit
        var match = buildCaseMatch(req.query || {})
        var collection = getCollection(Case)

        var items = []
        var total = 0
        var pending = 2
        var sent = false

        function done(err) {
            if (sent) {
                return
            }

            if (err) {
                sent = true
                return next(err)
            }

            pending--
            if (pending === 0) {
                sent = true
                res.json({
                    items: items,
                    total: total,
                    page: page,
                    limit: limit,
                    pages: total > 0 ? Math.ceil(total / limit) : 1
                })
            }
        }

        collection.countDocuments(match, function (err, count) {
            if (err) return done(err)
            total = count || 0
            done(null)
        })

        collection.aggregate([
            { $match: match },
            { $sort: { name: 1, _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $lookup: { from: 'court', localField: 'courtId', foreignField: '_id', as: 'courtInfo' } },
            { $lookup: { from: 'areaOfLaw', localField: 'areaOfLawId', foreignField: '_id', as: 'areaInfo' } },
            { $addFields: {
                courtInfo: { $arrayElemAt: ['$courtInfo', 0] },
                areaInfo: { $arrayElemAt: ['$areaInfo', 0] }
            } }
        ]).toArray(function (err, docs) {
            if (err) return done(err)
            items = (docs || []).map(normalizeCaseListItem)
            done(null)
        })
    })

    app.get(restRoot + '/admin/materials/cases/:id', requireAdmin, function (req, res, next) {
        var Case = app.models.case || app.models.Case

        Case.findById(req.params.id, {
            include: [
                { relation: 'court', scope: { fields: ['id', 'name'] } },
                { relation: 'areaOfLaw', scope: { fields: ['id', 'name'] } }
            ]
        }, function (err, caseDoc) {
            if (err) return next(err)
            if (!caseDoc) {
                return sendError(res, 404, 'Case not found.')
            }

            res.json({ item: normalizeCaseDocument(caseDoc) })
        })
    })

    app.post(restRoot + '/admin/materials/cases', requireAdmin, function (req, res, next) {
        var Case = app.models.case || app.models.Case
        var payload = sanitizeCasePayload(req.body, true)

        if (payload.errors.length) {
            return sendError(res, 422, 'Case validation failed.', payload.errors)
        }

        Case.create(payload.record, function (err, caseDoc) {
            if (err) return next(err)
            res.status(201).json({
                item: normalizeCaseDocument(caseDoc),
                message: 'Case created successfully.'
            })
        })
    })

    app.put(restRoot + '/admin/materials/cases/:id', requireAdmin, function (req, res, next) {
        var Case = app.models.case || app.models.Case
        var payload = sanitizeCasePayload(req.body, false)

        if (payload.errors.length) {
            return sendError(res, 422, 'Case validation failed.', payload.errors)
        }

        Case.findById(req.params.id, function (err, caseDoc) {
            if (err) return next(err)
            if (!caseDoc) {
                return sendError(res, 404, 'Case not found.')
            }

            caseDoc.updateAttributes(payload.record, function (updateErr, updatedCase) {
                if (updateErr) return next(updateErr)
                res.json({
                    item: normalizeCaseDocument(updatedCase || caseDoc),
                    message: 'Case updated successfully.'
                })
            })
        })
    })

    app.get(restRoot + '/admin/materials/legislations', requireAdmin, function (req, res, next) {
        if (req.query.legislationTypeId && !toObjectId(req.query.legislationTypeId)) {
            return sendError(res, 400, 'Legislation type filter is invalid.')
        }

        var Legislation = app.models.legislation || app.models.Legislation
        var page = parsePositiveInt(req.query.page, 1, 5000)
        var limit = parsePositiveInt(req.query.limit, 20, 100)
        var skip = (page - 1) * limit
        var match = buildLegislationMatch(req.query || {})
        var collection = getCollection(Legislation)

        var items = []
        var total = 0
        var pending = 2
        var sent = false

        function done(err) {
            if (sent) {
                return
            }

            if (err) {
                sent = true
                return next(err)
            }

            pending--
            if (pending === 0) {
                sent = true
                res.json({
                    items: items,
                    total: total,
                    page: page,
                    limit: limit,
                    pages: total > 0 ? Math.ceil(total / limit) : 1
                })
            }
        }

        collection.countDocuments(match, function (err, count) {
            if (err) return done(err)
            total = count || 0
            done(null)
        })

        collection.aggregate([
            { $match: match },
            { $sort: { legislationName: 1, _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $lookup: { from: 'legislationType', localField: 'legislationType', foreignField: '_id', as: 'legislationTypeInfo' } },
            { $addFields: { legislationTypeInfo: { $arrayElemAt: ['$legislationTypeInfo', 0] } } }
        ]).toArray(function (err, docs) {
            if (err) return done(err)
            items = (docs || []).map(normalizeLegislationListItem)
            done(null)
        })
    })

    app.get(restRoot + '/admin/materials/legislations/:id', requireAdmin, function (req, res, next) {
        var Legislation = app.models.legislation || app.models.Legislation
        var LegislationType = app.models.legislationType || app.models.LegislationType

        Legislation.findById(req.params.id, function (err, legislationDoc) {
            if (err) return next(err)
            if (!legislationDoc) {
                return sendError(res, 404, 'Legislation not found.')
            }

            var response = normalizeLegislationDocument(legislationDoc)
            if (!response.legislationTypeId) {
                return res.json({ item: response })
            }

            LegislationType.findById(response.legislationTypeId, function (typeErr, typeDoc) {
                if (typeErr) return next(typeErr)
                response.legislationTypeName = toTrimmedString(typeDoc && typeDoc.name)
                res.json({ item: response })
            })
        })
    })

    app.post(restRoot + '/admin/materials/legislations', requireAdmin, function (req, res, next) {
        var Legislation = app.models.legislation || app.models.Legislation
        var payload = sanitizeLegislationPayload(req.body, true)

        if (payload.errors.length) {
            return sendError(res, 422, 'Legislation validation failed.', payload.errors)
        }

        Legislation.create(payload.record, function (err, legislationDoc) {
            if (err) return next(err)
            res.status(201).json({
                item: normalizeLegislationDocument(legislationDoc),
                message: 'Legislation created successfully.'
            })
        })
    })

    app.put(restRoot + '/admin/materials/legislations/:id', requireAdmin, function (req, res, next) {
        var Legislation = app.models.legislation || app.models.Legislation
        var payload = sanitizeLegislationPayload(req.body, false)

        if (payload.errors.length) {
            return sendError(res, 422, 'Legislation validation failed.', payload.errors)
        }

        Legislation.findById(req.params.id, function (err, legislationDoc) {
            if (err) return next(err)
            if (!legislationDoc) {
                return sendError(res, 404, 'Legislation not found.')
            }

            legislationDoc.updateAttributes(payload.record, function (updateErr, updatedLegislation) {
                if (updateErr) return next(updateErr)
                res.json({
                    item: normalizeLegislationDocument(updatedLegislation || legislationDoc),
                    message: 'Legislation updated successfully.'
                })
            })
        })
    })

    // ──────────────────────────────────────────────────────────────────
    // Reference Data CRUD (courts, jurisdictions, locations, etc.)
    // ──────────────────────────────────────────────────────────────────

    function normalizeRefItem(doc, fieldName) {
        var item = {
            id: normalizeId(doc.id || doc._id),
            deleted: !!doc.deleted,
            createdAt: normalizeDate(doc.createdAt),
            updatedAt: normalizeDate(doc.updatedAt)
        }
        item[fieldName] = toTrimmedString(doc[fieldName])
        return item
    }

    function registerRefDataRoutes(pathSegment, modelName, fieldName) {
        var basePath = restRoot + '/admin/reference/' + pathSegment
        var Model = app.models[modelName]

        if (!Model) {
            console.warn('admin-routes: model "' + modelName + '" not found, skipping reference routes for /' + pathSegment)
            return
        }

        // LIST — GET /admin/reference/:entity
        app.get(basePath, requireAdmin, function (req, res, next) {
            var page = parsePositiveInt(req.query.page, 1, 5000)
            var limit = parsePositiveInt(req.query.limit, 20, 100)
            var search = toTrimmedString(req.query.search)
            var showDeleted = req.query.showDeleted === 'true'

            var where = showDeleted ? {} : { deleted: { neq: true } }
            if (search) {
                where[fieldName] = { like: search, options: 'i' }
            }

            Model.count(where, function (err, total) {
                if (err) return next(err)
                Model.find({
                    where: where,
                    order: fieldName + ' ASC',
                    skip: (page - 1) * limit,
                    limit: limit
                }, function (findErr, items) {
                    if (findErr) return next(findErr)
                    res.json({
                        items: (items || []).map(function (doc) { return normalizeRefItem(doc, fieldName) }),
                        total: total,
                        page: page,
                        limit: limit,
                        pages: Math.ceil(total / limit) || 1
                    })
                })
            })
        })

        // GET ONE — GET /admin/reference/:entity/:id
        app.get(basePath + '/:id', requireAdmin, function (req, res, next) {
            var id = toTrimmedString(req.params.id)
            if (!id) return sendError(res, 400, 'ID is required.')

            Model.findById(id, function (err, doc) {
                if (err) return next(err)
                if (!doc) return sendError(res, 404, 'Record not found.')
                res.json({ item: normalizeRefItem(doc, fieldName) })
            })
        })

        // CREATE — POST /admin/reference/:entity
        app.post(basePath, requireAdmin, function (req, res, next) {
            var value = toTrimmedString(req.body[fieldName])
            if (!value) {
                return sendError(res, 422, fieldName + ' is required.')
            }

            var record = { deleted: false }
            record[fieldName] = value

            Model.create(record, function (err, created) {
                if (err) return next(err)
                res.status(201).json({
                    item: normalizeRefItem(created, fieldName),
                    message: 'Created successfully.'
                })
            })
        })

        // UPDATE — PUT /admin/reference/:entity/:id
        app.put(basePath + '/:id', requireAdmin, function (req, res, next) {
            var id = toTrimmedString(req.params.id)
            if (!id) return sendError(res, 400, 'ID is required.')

            Model.findById(id, function (err, doc) {
                if (err) return next(err)
                if (!doc) return sendError(res, 404, 'Record not found.')

                var updates = {}
                if (hasOwn(req.body, fieldName)) {
                    var value = toTrimmedString(req.body[fieldName])
                    if (!value) return sendError(res, 422, fieldName + ' is required.')
                    updates[fieldName] = value
                }
                if (hasOwn(req.body, 'deleted')) {
                    updates.deleted = !!req.body.deleted
                }

                if (Object.keys(updates).length === 0) {
                    return res.json({ item: normalizeRefItem(doc, fieldName), message: 'No changes.' })
                }

                doc.updateAttributes(updates, function (updateErr, updated) {
                    if (updateErr) return next(updateErr)
                    res.json({
                        item: normalizeRefItem(updated || doc, fieldName),
                        message: 'Updated successfully.'
                    })
                })
            })
        })

        // SOFT DELETE — DELETE /admin/reference/:entity/:id
        app.delete(basePath + '/:id', requireAdmin, function (req, res, next) {
            var id = toTrimmedString(req.params.id)
            if (!id) return sendError(res, 400, 'ID is required.')

            Model.findById(id, function (err, doc) {
                if (err) return next(err)
                if (!doc) return sendError(res, 404, 'Record not found.')

                doc.updateAttributes({ deleted: true }, function (updateErr) {
                    if (updateErr) return next(updateErr)
                    res.json({ message: 'Archived successfully.' })
                })
            })
        })

        // RESTORE — PATCH /admin/reference/:entity/:id/restore
        app.patch(basePath + '/:id/restore', requireAdmin, function (req, res, next) {
            var id = toTrimmedString(req.params.id)
            if (!id) return sendError(res, 400, 'ID is required.')

            Model.findById(id, function (err, doc) {
                if (err) return next(err)
                if (!doc) return sendError(res, 404, 'Record not found.')

                doc.updateAttributes({ deleted: false }, function (updateErr, updated) {
                    if (updateErr) return next(updateErr)
                    res.json({
                        item: normalizeRefItem(updated || doc, fieldName),
                        message: 'Restored successfully.'
                    })
                })
            })
        })
    }

    // Register routes for all 8 reference data entities
    registerRefDataRoutes('courts', 'court', 'name')
    registerRefDataRoutes('jurisdictions', 'jurisdiction', 'name')
    registerRefDataRoutes('locations', 'location', 'name')
    registerRefDataRoutes('areas-of-law', 'areaOfLaw', 'name')
    registerRefDataRoutes('legislation-types', 'legislationType', 'name')
    registerRefDataRoutes('part-types', 'partType', 'name')
    registerRefDataRoutes('plaintiff-synonyms', 'plaintiffSynonyms', 'synonym')
    registerRefDataRoutes('defendant-synonyms', 'defendantSynonyms', 'synonym')

    // ──────────────────────────────────────────────────────────────────
    // Court Divisions sub-routes
    // ──────────────────────────────────────────────────────────────────

    var divBasePath = restRoot + '/admin/reference/courts'

    // LIST divisions for a court
    app.get(divBasePath + '/:courtId/divisions', requireAdmin, function (req, res, next) {
        var courtId = toTrimmedString(req.params.courtId)
        if (!courtId) return sendError(res, 400, 'Court ID is required.')

        var CourtDivision = app.models.courtDivision
        if (!CourtDivision) return sendError(res, 503, 'Court division model not available.')

        CourtDivision.find({
            where: { court: courtId, deleted: { neq: true } },
            order: 'name ASC'
        }, function (err, items) {
            if (err) return next(err)
            res.json({
                items: (items || []).map(function (doc) {
                    return {
                        id: normalizeId(doc.id || doc._id),
                        name: toTrimmedString(doc.name),
                        courtId: toTrimmedString(doc.court)
                    }
                })
            })
        })
    })

    // CREATE division for a court
    app.post(divBasePath + '/:courtId/divisions', requireAdmin, function (req, res, next) {
        var courtId = toTrimmedString(req.params.courtId)
        if (!courtId) return sendError(res, 400, 'Court ID is required.')

        var name = toTrimmedString(req.body.name)
        if (!name) return sendError(res, 422, 'Division name is required.')

        var CourtDivision = app.models.courtDivision
        if (!CourtDivision) return sendError(res, 503, 'Court division model not available.')

        CourtDivision.create({ name: name, court: courtId, deleted: false }, function (err, created) {
            if (err) return next(err)
            res.status(201).json({
                item: {
                    id: normalizeId(created.id || created._id),
                    name: toTrimmedString(created.name),
                    courtId: toTrimmedString(created.court)
                },
                message: 'Division created.'
            })
        })
    })

    // SOFT DELETE division
    app.delete(divBasePath + '/:courtId/divisions/:divId', requireAdmin, function (req, res, next) {
        var courtId = toTrimmedString(req.params.courtId)
        var divId = toTrimmedString(req.params.divId)
        if (!divId) return sendError(res, 400, 'Division ID is required.')

        var CourtDivision = app.models.courtDivision
        if (!CourtDivision) return sendError(res, 503, 'Court division model not available.')

        CourtDivision.findById(divId, function (err, doc) {
            if (err) return next(err)
            if (!doc) return sendError(res, 404, 'Division not found.')
            if (toTrimmedString(doc.court) !== courtId) {
                return sendError(res, 404, 'Division not found.')
            }

            doc.updateAttributes({ deleted: true }, function (updateErr) {
                if (updateErr) return next(updateErr)
                res.json({ message: 'Division archived.' })
            })
        })
    })
}
