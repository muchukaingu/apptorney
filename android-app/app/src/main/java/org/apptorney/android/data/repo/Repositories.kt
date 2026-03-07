package org.apptorney.android.data.repo

import android.content.Context
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import org.apptorney.android.data.SessionStore
import org.apptorney.android.data.model.ApiResult
import org.apptorney.android.data.model.AreaOfLaw
import org.apptorney.android.data.model.AskAiResult
import org.apptorney.android.data.model.CaseDetail
import org.apptorney.android.data.model.CaseReference
import org.apptorney.android.data.model.CaseSummary
import org.apptorney.android.data.model.ChatMessage
import org.apptorney.android.data.model.ChatReference
import org.apptorney.android.data.model.ChatThreadSummary
import org.apptorney.android.data.model.Citation
import org.apptorney.android.data.model.FlatLegislationPart
import org.apptorney.android.data.model.HomeItem
import org.apptorney.android.data.model.LegislationDetail
import org.apptorney.android.data.model.LegislationPart
import org.apptorney.android.data.model.LegislationReference
import org.apptorney.android.data.model.LegislationSummary
import org.apptorney.android.data.model.LegislationTypeOption
import org.apptorney.android.data.network.ApiClient
import org.apptorney.android.data.network.RawResponse
import org.apptorney.android.data.network.SseEvent
import org.apptorney.android.data.network.arr
import org.apptorney.android.data.network.asArray
import org.apptorney.android.data.network.asObject
import org.apptorney.android.data.network.intOrNull
import org.apptorney.android.data.network.obj
import org.apptorney.android.data.network.path
import org.apptorney.android.data.network.string

class AuthRepository(
    private val api: ApiClient,
    private val sessionStore: SessionStore,
) {
    /** Step 1 of login: send email to get OTP. */
    suspend fun login(email: String): ApiResult<String> {
        val trimmed = email.trim().lowercase()
        if (trimmed.isBlank() || !trimmed.contains('@')) {
            return ApiResult.Failure("A valid email address is required.")
        }

        val body = JsonObject(mapOf("email" to JsonPrimitive(trimmed)))
        val response = api.postJson("/auth/login", body)

        if (!response.isSuccessful) {
            return ApiResult.Failure(
                messageFromResponse(response, "Unable to send verification code. Please try again."),
                response.code,
                response.throwable,
            )
        }

        sessionStore.email = trimmed
        return ApiResult.Success(trimmed)
    }

    /** Step 2 of login: verify OTP and get tokens. */
    suspend fun verifyOtp(email: String, otp: String): ApiResult<Unit> {
        val trimmedEmail = email.trim().lowercase()
        val trimmedOtp = otp.trim()

        if (trimmedEmail.isBlank()) return ApiResult.Failure("Email is required.")
        if (trimmedOtp.isBlank()) return ApiResult.Failure("Verification code is required.")

        val body = JsonObject(mapOf(
            "email" to JsonPrimitive(trimmedEmail),
            "otp" to JsonPrimitive(trimmedOtp),
        ))
        val response = api.postJson("/auth/verify-otp", body)

        if (!response.isSuccessful) {
            return ApiResult.Failure(
                messageFromResponse(response, "Verification failed. Please try again."),
                response.code,
                response.throwable,
            )
        }

        val json = response.jsonOrNull()?.asObject()
        val accessToken = json?.string("accessToken").orEmpty()
        val refreshToken = json?.string("refreshToken").orEmpty()

        if (accessToken.isNotBlank()) {
            sessionStore.saveAuthTokens(accessToken, refreshToken)
        }

        val user = json?.obj("user")
        if (user != null) {
            sessionStore.saveUser(
                id = user.string("id").ifBlank { user.string("_id") },
                firstName = user.string("firstName"),
                lastName = user.string("lastName"),
                email = user.string("email"),
            )
        }

        sessionStore.loginComplete = true
        sessionStore.email = trimmedEmail
        return ApiResult.Success(Unit)
    }

    /** Register a new account. Backend sends OTP to verify. */
    suspend fun register(
        email: String,
        firstName: String,
        lastName: String,
        phoneNumber: String,
        organization: String,
    ): ApiResult<String> {
        val trimmedEmail = email.trim().lowercase()
        if (trimmedEmail.isBlank() || !trimmedEmail.contains('@')) {
            return ApiResult.Failure("A valid email address is required.")
        }
        if (firstName.isBlank() || lastName.isBlank()) {
            return ApiResult.Failure("First name and last name are required.")
        }

        val fields = mutableMapOf<String, JsonElement>(
            "email" to JsonPrimitive(trimmedEmail),
            "firstName" to JsonPrimitive(firstName.trim()),
            "lastName" to JsonPrimitive(lastName.trim()),
        )
        if (phoneNumber.isNotBlank()) fields["phoneNumber"] = JsonPrimitive(phoneNumber.trim())
        if (organization.isNotBlank()) fields["organization"] = JsonPrimitive(organization.trim())

        val body = JsonObject(fields)
        val response = api.postJson("/auth/register", body)

        if (!response.isSuccessful) {
            val fallback = if (response.code == 409) {
                "An account with this email already exists."
            } else {
                "Registration failed. Please try again."
            }
            return ApiResult.Failure(messageFromResponse(response, fallback), response.code, response.throwable)
        }

        sessionStore.email = trimmedEmail
        return ApiResult.Success(trimmedEmail)
    }

    /** Refresh the access token using the refresh token. */
    suspend fun refreshAccessToken(): ApiResult<String> {
        val currentRefreshToken = sessionStore.refreshToken
        if (currentRefreshToken.isBlank()) {
            return ApiResult.Failure("No refresh token available.")
        }

        val body = JsonObject(mapOf("refreshToken" to JsonPrimitive(currentRefreshToken)))
        val response = api.postJson("/auth/refresh", body)

        if (!response.isSuccessful) {
            return ApiResult.Failure(
                messageFromResponse(response, "Session expired. Please log in again."),
                response.code,
                response.throwable,
            )
        }

        val json = response.jsonOrNull()?.asObject()
        val newAccessToken = json?.string("accessToken").orEmpty()
        if (newAccessToken.isNotBlank()) {
            sessionStore.accessToken = newAccessToken
        }
        return ApiResult.Success(newAccessToken)
    }
}

class ContentRepository(
    private val api: ApiClient,
    private val sessionStore: SessionStore,
) {
    suspend fun checkForUpdate(version: String): ApiResult<Boolean> {
        val response = api.postForm("/updates/checkForUpdate", mapOf("version" to version))
        if (!response.isSuccessful) {
            return ApiResult.Success(false)
        }

        val data = response.jsonOrNull()
            ?.asObject()
            ?.string("data")
            .orEmpty()
        return ApiResult.Success(data.equals("update", ignoreCase = true))
    }

    suspend fun searchCases(term: String): ApiResult<List<CaseSummary>> {
        val response = api.get("/cases/mobilesearch", mapOf("term" to term))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Case search failed."), response.code, response.throwable)
        }

        val array = response.jsonOrNull().asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseCaseSummary(it.asObject()) })
    }

    suspend fun getCasesByArea(areaId: String): ApiResult<List<CaseSummary>> {
        val response = api.get("/cases/getByArea", mapOf("areaId" to areaId))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load cases."), response.code, response.throwable)
        }

        val array = response.jsonOrNull()
            ?.asObject()
            ?.path("data", "cases")
            .asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseCaseSummary(it.asObject()) })
    }

    suspend fun getCasesByYear(year: Int): ApiResult<List<CaseSummary>> {
        val response = api.get("/cases/getByYear", mapOf("year" to year.toString()))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load cases."), response.code, response.throwable)
        }

        val array = response.jsonOrNull()
            ?.asObject()
            ?.path("data", "cases")
            .asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseCaseSummary(it.asObject()) })
    }

    suspend fun loadCase(caseId: String): ApiResult<CaseDetail> {
        val response = api.get("/cases/viewCase", mapOf("id" to caseId))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load case."), response.code, response.throwable)
        }

        val caseObject = response.jsonOrNull()
            ?.asObject()
            ?.path("data", "cases")
            .asObject()
            ?: return ApiResult.Failure("Case data unavailable.")

        return ApiResult.Success(parseCaseDetail(caseObject))
    }

    suspend fun searchLegislations(term: String): ApiResult<List<LegislationSummary>> {
        val response = api.get("/legislations/mobilesearch", mapOf("term" to term))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Legislation search failed."), response.code, response.throwable)
        }

        val array = response.jsonOrNull().asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseLegislationSummary(it.asObject()) })
    }

    suspend fun getLegislationsByVolume(volume: Int): ApiResult<List<LegislationSummary>> {
        val response = api.get("/legislations/getByVolume", mapOf("volume" to volume.toString()))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load legislations."), response.code, response.throwable)
        }

        val array = response.jsonOrNull()
            ?.asObject()
            ?.path("data", "legislations")
            .asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseLegislationSummary(it.asObject()) })
    }

    suspend fun getLegislationsByYear(year: Int, type: String): ApiResult<List<LegislationSummary>> {
        val response = api.get("/legislations/getByYear", mapOf("year" to year.toString(), "type" to type))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load legislations."), response.code, response.throwable)
        }

        val array = response.jsonOrNull()
            ?.asObject()
            ?.path("data", "legislations")
            .asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseLegislationSummary(it.asObject()) })
    }

    suspend fun loadLegislation(legislationId: String): ApiResult<LegislationDetail> {
        val response = api.get("/legislations/viewLegislation", mapOf("id" to legislationId))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load legislation."), response.code, response.throwable)
        }

        val obj = response.jsonOrNull()
            ?.asObject()
            ?.path("data", "legislation")
            .asObject()
            ?: return ApiResult.Failure("Legislation data unavailable.")
        return ApiResult.Success(parseLegislationDetail(obj))
    }

    suspend fun getAreasOfLaw(): ApiResult<List<AreaOfLaw>> {
        val response = api.get("/areaOfLaws/parents")
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load domains."), response.code, response.throwable)
        }

        val array = response.jsonOrNull()
            ?.asObject()
            ?.path("data")
            .asArray() ?: JsonArray(emptyList())

        return ApiResult.Success(
            array.mapNotNull { item ->
                val obj = item.asObject() ?: return@mapNotNull null
                val id = obj.string("id").ifBlank { obj.string("_id") }
                if (id.isBlank()) return@mapNotNull null
                AreaOfLaw(
                    id = id,
                    name = obj.string("name"),
                    description = obj.string("description"),
                )
            },
        )
    }

    suspend fun getLegislationTypes(): ApiResult<List<LegislationTypeOption>> {
        val response = api.get("/legislationTypes")
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load legislation types."), response.code, response.throwable)
        }
        val array = response.jsonOrNull()
            ?.asObject()
            ?.path("data")
            .asArray() ?: JsonArray(emptyList())

        return ApiResult.Success(
            array.mapNotNull { item ->
                val obj = item.asObject() ?: return@mapNotNull null
                val id = obj.string("id").ifBlank { obj.string("_id") }
                if (id.isBlank()) return@mapNotNull null
                LegislationTypeOption(
                    id = id,
                    name = obj.string("name"),
                    description = obj.string("description"),
                )
            },
        )
    }

    suspend fun getBookmarks(): ApiResult<List<HomeItem>> {
        val email = sessionStore.email
        if (email.isBlank()) {
            return ApiResult.Success(emptyList())
        }

        val response = api.get("/Customers/bookmarks", mapOf("username" to email))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load bookmarks."), response.code, response.throwable)
        }

        val array = response.jsonOrNull().asArray() ?: JsonArray(emptyList())
        val items = array.mapNotNull { parseHomeItem(it.asObject()) }
        sessionStore.setBookmarks(items.map { it.sourceId })
        return ApiResult.Success(items)
    }

    suspend fun addBookmark(sourceId: String, type: String): ApiResult<Unit> {
        val email = sessionStore.email
        if (email.isBlank()) {
            return ApiResult.Failure("You must be logged in.")
        }

        val response = api.postForm(
            "/Customers/bookmark",
            mapOf(
                "username" to email,
                "sourceId" to sourceId,
                "type" to type,
            ),
        )

        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to update bookmark."), response.code, response.throwable)
        }

        return ApiResult.Success(Unit)
    }

    suspend fun getNews(): ApiResult<List<HomeItem>> {
        val response = api.get("/news/viewNews")
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load news."), response.code, response.throwable)
        }
        val array = response.jsonOrNull().asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseHomeItem(it.asObject()) })
    }

    suspend fun getTrends(): ApiResult<List<HomeItem>> {
        val response = api.get("/trendings/viewTrends")
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load trends."), response.code, response.throwable)
        }
        val array = response.jsonOrNull().asArray() ?: JsonArray(emptyList())
        return ApiResult.Success(array.mapNotNull { parseHomeItem(it.asObject()) })
    }

    suspend fun sendFeedback(feedback: String, scopeId: String, resourceType: String, appVersion: String): ApiResult<Unit> {
        val email = sessionStore.email
        if (email.isBlank()) {
            return ApiResult.Failure("You must be logged in.")
        }

        val params = mutableMapOf(
            "appVersion" to appVersion,
            "platform" to "Android",
            "username" to email,
            "feedback" to feedback,
            "scope" to scopeId,
        )
        params[resourceType] = scopeId

        val response = api.postForm("/feedback", params)
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to send feedback."), response.code, response.throwable)
        }
        return ApiResult.Success(Unit)
    }

    fun flattenLegislationParts(parts: List<LegislationPart>): List<FlatLegislationPart> {
        val result = mutableListOf<FlatLegislationPart>()

        fun flatten(node: LegislationPart) {
            result += FlatLegislationPart(
                number = node.number,
                title = node.title,
                content = node.content,
            )
            node.subParts.forEach { flatten(it) }
        }

        parts.forEach { flatten(it) }
        return result
    }

    private fun parseHomeItem(obj: JsonObject?): HomeItem? {
        obj ?: return null
        val sourceId = obj.string("sourceId")
        return HomeItem(
            title = obj.string("title"),
            summary = obj.string("summary"),
            type = obj.string("type"),
            sourceId = sourceId,
        )
    }

    private fun parseCitation(obj: JsonObject?): Citation {
        return Citation(
            description = obj?.string("description").orEmpty(),
            number = obj?.string("number").orEmpty(),
            year = obj?.intOrNull("year"),
            code = obj?.string("code").orEmpty(),
            pageNumber = obj?.intOrNull("pageNumber"),
        )
    }

    private fun parseCaseSummary(obj: JsonObject?): CaseSummary? {
        obj ?: return null
        val id = obj.string("id").ifBlank { obj.string("_id") }
        if (id.isBlank()) return null

        return CaseSummary(
            id = id,
            name = obj.string("name"),
            highlight = obj.string("highlight"),
            summaryOfRuling = obj.string("summaryOfRuling"),
            areaOfLawName = obj.obj("areaOfLaw")?.string("name").orEmpty(),
            caseNumber = obj.string("caseNumber"),
            citation = parseCitation(obj.obj("citation")),
        )
    }

    private fun parseCaseDetail(obj: JsonObject): CaseDetail {
        val id = obj.string("id").ifBlank { obj.string("_id") }

        val caseRefs = obj.arr("casesReferedTo").mapNotNull { item ->
            val ref = item.asObject() ?: return@mapNotNull null
            val refId = ref.string("id").ifBlank { ref.string("_id") }
            if (refId.isBlank()) return@mapNotNull null
            CaseReference(id = refId, name = ref.string("name"))
        }

        val legislationRefs = obj.arr("legislationsReferedTo").mapNotNull { item ->
            val ref = item.asObject() ?: return@mapNotNull null
            val refId = ref.string("id").ifBlank { ref.string("_id") }
            if (refId.isBlank()) return@mapNotNull null
            LegislationReference(id = refId, name = ref.string("legislationName"))
        }

        return CaseDetail(
            id = id,
            name = obj.string("name"),
            caseNumber = obj.string("caseNumber"),
            areaOfLawName = obj.obj("areaOfLaw")?.string("name").orEmpty(),
            courtName = obj.obj("court")?.string("name").orEmpty(),
            jurisdictionName = obj.obj("jurisdiction")?.string("name").orEmpty(),
            locationName = obj.obj("location")?.string("name").orEmpty(),
            coram = obj.arr("coram").mapNotNull { it.asObject()?.string("name")?.ifBlank { null } },
            summaryOfFacts = obj.string("summaryOfFacts"),
            summaryOfRuling = obj.string("summaryOfRuling"),
            judgement = obj.string("judgement"),
            citation = parseCitation(obj.obj("citation")),
            caseReferences = caseRefs,
            legislationReferences = legislationRefs,
        )
    }

    private fun parseLegislationSummary(obj: JsonObject?): LegislationSummary? {
        obj ?: return null
        val id = obj.string("id").ifBlank { obj.string("_id") }
        if (id.isBlank()) return null

        return LegislationSummary(
            id = id,
            name = obj.string("legislationName"),
            highlight = obj.string("highlight"),
            preamble = obj.string("preamble"),
            legislationType = obj.string("legislationType"),
            yearOfAmendment = obj.intOrNull("yearOfAmendment"),
        )
    }

    private fun parseLegislationPart(obj: JsonObject): LegislationPart {
        val sub = obj.arr("subParts").mapNotNull { part ->
            part.asObject()?.let { parseLegislationPart(it) }
        }

        return LegislationPart(
            number = obj.string("number"),
            title = obj.string("title"),
            content = obj.string("content"),
            flatContentNew = obj.string("flatContentNew"),
            subParts = sub,
        )
    }

    private fun parseLegislationDetail(obj: JsonObject): LegislationDetail {
        val id = obj.string("id").ifBlank { obj.string("_id") }
        val parts = obj.arr("legislationParts").mapNotNull { item ->
            item.asObject()?.let { parseLegislationPart(it) }
        }

        return LegislationDetail(
            id = id,
            legislationName = obj.string("legislationName"),
            legislationType = obj.string("legislationType"),
            preamble = obj.string("preamble"),
            enactment = obj.string("enactment"),
            volumeNumber = obj.string("volumeNumber"),
            chapterNumber = obj.string("chapterNumber"),
            dateOfAssent = obj.string("dateOfAssent"),
            yearOfAmendment = obj.intOrNull("yearOfAmendment"),
            parts = parts,
        )
    }
}

sealed interface StreamEvent {
    data class Token(val text: String) : StreamEvent
    data class Metadata(val references: List<ChatReference>) : StreamEvent
    data class Done(val fullAnswer: String, val threadId: String?) : StreamEvent
    data class Error(val message: String) : StreamEvent
}

class ChatRepository(
    private val api: ApiClient,
    private val sessionStore: SessionStore,
) {
    suspend fun getThreads(limit: Int = 30): ApiResult<List<ChatThreadSummary>> {
        val response = api.get("/search/chat-threads", mapOf("limit" to limit.toString()))
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load conversations."), response.code, response.throwable)
        }

        val parsed = parseThreadSummaries(response.jsonOrNull())
        return ApiResult.Success(parsed)
    }

    suspend fun getThreadHistory(threadId: String): ApiResult<List<ChatMessage>> {
        val response = api.get("/search/chat-threads/$threadId")
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Unable to load conversation."), response.code, response.throwable)
        }

        val messages = parseThreadHistory(response.jsonOrNull())
        return ApiResult.Success(messages)
    }

    suspend fun askAi(prompt: String, threadId: String?): ApiResult<AskAiResult> {
        val trimmed = prompt.trim()
        if (trimmed.isBlank()) {
            return ApiResult.Failure("Prompt cannot be empty.")
        }

        val query = mutableMapOf("question" to trimmed)
        if (!threadId.isNullOrBlank()) query["threadId"] = threadId

        val response = api.get("/searches/ask-ai", query)
        if (!response.isSuccessful) {
            return ApiResult.Failure(messageFromResponse(response, "Sorry, I couldn't get a response right now."), response.code, response.throwable)
        }

        val parsed = parseAskAIResponse(response.jsonOrNull(), response.body)
            ?: return ApiResult.Failure("Sorry, I couldn't get a response right now.")

        return ApiResult.Success(parsed)
    }

    fun askAiStream(prompt: String, threadId: String?): Flow<StreamEvent> = flow {
        val trimmed = prompt.trim()
        if (trimmed.isBlank()) {
            emit(StreamEvent.Error("Prompt cannot be empty."))
            return@flow
        }

        val query = mutableMapOf(
            "question" to trimmed,
            "includeCases" to "true",
            "includeLegislations" to "true",
            "stream" to "true",
        )
        if (!threadId.isNullOrBlank()) query["threadId"] = threadId

        try {
            api.streamSse("/searches/ask-ai", query).collect { sseEvent ->
                val data = sseEvent.data.trim()
                if (data == "[DONE]") {
                    return@collect
                }

                val json = try {
                    RawResponse.json.decodeFromString(JsonElement.serializer(), data).asObject()
                } catch (_: Throwable) {
                    null
                }

                when (sseEvent.event) {
                    "metadata" -> {
                        val sources = json?.arr("sources") ?: JsonArray(emptyList())
                        val refs = sources.mapNotNull { item ->
                            val obj = item.asObject() ?: return@mapNotNull null
                            val source = obj.string("source")
                            val id = obj.string("id")
                            val type = obj.string("type")
                            if (source.isBlank() || id.isBlank() || type.isBlank()) return@mapNotNull null
                            ChatReference(
                                source = source.uppercase(),
                                id = id,
                                type = type.lowercase(),
                                title = obj.string("title").ifBlank { source.uppercase() },
                            )
                        }
                        emit(StreamEvent.Metadata(refs))
                    }

                    "token" -> {
                        val text = json?.string("text").orEmpty()
                        if (text.isNotEmpty()) emit(StreamEvent.Token(text))
                    }

                    "done" -> {
                        val answer = json?.string("answer").orEmpty()
                        val tid = json?.obj("thread")?.string("id")?.ifBlank { null }
                        emit(StreamEvent.Done(answer, tid))
                    }

                    "error" -> {
                        val message = json?.string("message").orEmpty().ifBlank { "An error occurred." }
                        emit(StreamEvent.Error(message))
                    }
                }
            }
        } catch (t: Throwable) {
            emit(StreamEvent.Error(t.message ?: "Connection error."))
        }
    }

    private fun parseThreadSummaries(jsonElement: JsonElement?): List<ChatThreadSummary> {
        val obj = jsonElement.asObject() ?: return emptyList()
        val data = obj.obj("data") ?: obj

        val threadsArray = when {
            data["threads"] is JsonArray -> data.arr("threads")
            data["threads"] is JsonObject -> (data.obj("threads")?.arr("threads") ?: JsonArray(emptyList()))
            else -> JsonArray(emptyList())
        }

        return threadsArray.mapNotNull { item ->
            val threadObj = item.asObject() ?: return@mapNotNull null
            val id = threadObj.string("id")
            if (id.isBlank()) return@mapNotNull null
            ChatThreadSummary(
                id = id,
                title = threadObj.string("title"),
                updatedAt = threadObj.string("updatedAt"),
                lastQuestion = threadObj.string("lastQuestion"),
            )
        }
    }

    private fun parseThreadHistory(jsonElement: JsonElement?): List<ChatMessage> {
        val obj = jsonElement.asObject() ?: return emptyList()
        var data = obj.obj("data") ?: obj
        data = data.obj("thread") ?: data

        return data.arr("history").mapNotNull { item ->
            val messageObj = item.asObject() ?: return@mapNotNull null
            val role = messageObj.string("role")
            val content = messageObj.string("content").trim()
            if (content.isBlank()) return@mapNotNull null
            ChatMessage(text = content, isUser = role.equals("user", ignoreCase = true))
        }
    }

    private fun parseAskAIResponse(jsonElement: JsonElement?, rawBody: String): AskAiResult? {
        if (jsonElement == null) {
            val text = rawBody.trim()
            if (text.isBlank()) return null
            return AskAiResult(text, emptyList(), null)
        }

        if (jsonElement !is JsonObject) {
            val text = rawBody.trim()
            if (text.isBlank()) return null
            return AskAiResult(text, emptyList(), null)
        }

        val dict = jsonElement
        val data = dict.obj("data") ?: JsonObject(emptyMap())
        val answerKeys = listOf("answer", "response", "message", "text", "output")

        val answer = answerKeys
            .firstNotNullOfOrNull { key ->
                val root = dict.string(key)
                if (root.isNotBlank()) root else null
            }
            ?: answerKeys.firstNotNullOfOrNull { key ->
                val nested = data.string(key)
                if (nested.isNotBlank()) nested else null
            }
            ?: rawBody.trim().takeIf { it.isNotBlank() }
            ?: return null

        val threadId = data.obj("thread")?.string("id").orEmpty().ifBlank { null }

        val sourceList = when {
            data["sources"] is JsonArray -> data.arr("sources")
            dict["sources"] is JsonArray -> dict.arr("sources")
            else -> JsonArray(emptyList())
        }

        val references = sourceList.mapNotNull { item ->
            val sourceObj = item.asObject() ?: return@mapNotNull null
            val source = sourceObj.string("source")
            val id = sourceObj.string("id")
            val type = sourceObj.string("type")
            if (source.isBlank() || id.isBlank() || type.isBlank()) return@mapNotNull null
            ChatReference(
                source = source.uppercase(),
                id = id,
                type = type.lowercase(),
                title = sourceObj.string("title").ifBlank { source.uppercase() },
            )
        }

        return AskAiResult(
            answer = answer,
            references = references,
            threadId = threadId,
        )
    }
}

class AppContainer(context: Context) {
    val sessionStore = SessionStore(context)
    private val apiClient = ApiClient(sessionStore)

    val authRepository = AuthRepository(apiClient, sessionStore)
    val contentRepository = ContentRepository(apiClient, sessionStore)
    val chatRepository = ChatRepository(apiClient, sessionStore)
}

private fun messageFromResponse(response: RawResponse, fallback: String): String {
    val bodyMessage = response.jsonOrNull()?.asObject()?.string("message").orEmpty()
    if (bodyMessage.isNotBlank()) return bodyMessage
    return if (response.message.isNotBlank()) {
        "$fallback (${response.message})"
    } else {
        fallback
    }
}
