package org.apptorney.android.data.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import okhttp3.FormBody
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.sse.EventSource
import okhttp3.sse.EventSourceListener
import okhttp3.sse.EventSources
import org.apptorney.android.data.SessionStore

class ApiClient(
    private val sessionStore: SessionStore,
) {
    private val client = OkHttpClient.Builder().build()

    suspend fun get(path: String, query: Map<String, String?> = emptyMap()): RawResponse {
        return execute("GET", path, query = query)
    }

    suspend fun postForm(path: String, params: Map<String, String?>): RawResponse {
        val bodyBuilder = FormBody.Builder()
        params.forEach { (key, value) ->
            if (!value.isNullOrBlank()) {
                bodyBuilder.add(key, value)
            }
        }
        return execute("POST", path, requestBody = bodyBuilder.build())
    }

    suspend fun postJson(path: String, body: JsonObject): RawResponse {
        val requestBody = body.toString().toRequestBody("application/json".toMediaType())
        return execute("POST", path, requestBody = requestBody, jsonContentType = true)
    }

    fun streamSse(path: String, query: Map<String, String?> = emptyMap()): Flow<SseEvent> = callbackFlow {
        val httpUrl = buildUrl(path, query) ?: run {
            close(IllegalArgumentException("Invalid URL"))
            return@callbackFlow
        }

        val token = sessionStore.accessToken
        val request = Request.Builder()
            .url(httpUrl)
            .header("Accept", "text/event-stream")
            .header("Accept-Encoding", "identity")
            .apply {
                if (token.isNotBlank()) {
                    header("Authorization", "Bearer $token")
                }
            }
            .get()
            .build()

        val factory = EventSources.createFactory(client)

        val listener = object : EventSourceListener() {
            override fun onEvent(eventSource: EventSource, id: String?, type: String?, data: String) {
                trySend(SseEvent(event = type.orEmpty(), data = data))
            }

            override fun onFailure(eventSource: EventSource, t: Throwable?, response: okhttp3.Response?) {
                close(t)
            }

            override fun onClosed(eventSource: EventSource) {
                close()
            }
        }

        val eventSource = factory.newEventSource(request, listener)

        awaitClose { eventSource.cancel() }
    }

    private suspend fun execute(
        method: String,
        path: String,
        query: Map<String, String?> = emptyMap(),
        requestBody: RequestBody? = null,
        jsonContentType: Boolean = false,
    ): RawResponse = withContext(Dispatchers.IO) {
        val httpUrl = buildUrl(path, query)
            ?: return@withContext RawResponse(0, "", "Invalid URL")

        val builder = Request.Builder()
            .url(httpUrl)
            .header("Accept", "application/json")

        val token = sessionStore.accessToken
        if (token.isNotBlank()) {
            builder.header("Authorization", "Bearer $token")
        }

        if (jsonContentType) {
            builder.header("Content-Type", "application/json")
        }

        when (method.uppercase()) {
            "GET" -> builder.get()
            "POST" -> builder.post(requestBody ?: EMPTY_BODY)
            else -> builder.method(method.uppercase(), requestBody)
        }

        try {
            client.newCall(builder.build()).execute().use { response ->
                RawResponse(
                    code = response.code,
                    body = response.body?.string().orEmpty(),
                    message = response.message,
                )
            }
        } catch (t: Throwable) {
            RawResponse(code = 0, body = "", message = t.message ?: "Network error", throwable = t)
        }
    }

    private fun buildUrl(path: String, query: Map<String, String?>): HttpUrl? {
        val base = BASE_URL.toHttpUrlOrNullSafe() ?: return null
        val urlBuilder = base.newBuilder()

        val normalizedPath = path.removePrefix("/")
        if (normalizedPath.isNotEmpty()) {
            normalizedPath.split('/').forEach { segment ->
                if (segment.isNotEmpty()) {
                    urlBuilder.addPathSegment(segment)
                }
            }
        }

        query.forEach { (key, value) ->
            if (!value.isNullOrBlank()) {
                urlBuilder.addQueryParameter(key, value)
            }
        }

        return urlBuilder.build()
    }

    companion object {
        const val BASE_URL = "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api"

        private val EMPTY_BODY = ByteArray(0).toRequestBody(null)
    }
}

data class RawResponse(
    val code: Int,
    val body: String,
    val message: String,
    val throwable: Throwable? = null,
) {
    val isSuccessful: Boolean get() = code in 200..299

    fun jsonOrNull(): JsonElement? {
        return try {
            if (body.isBlank()) null else json.decodeFromString(JsonElement.serializer(), body)
        } catch (_: Throwable) {
            null
        }
    }

    companion object {
        val json = Json {
            ignoreUnknownKeys = true
            isLenient = true
            coerceInputValues = true
        }
    }
}

data class SseEvent(
    val event: String,
    val data: String,
)

private fun String.toHttpUrlOrNullSafe(): HttpUrl? =
    this.toHttpUrlOrNull()

fun JsonElement?.asObject(): JsonObject? = this as? JsonObject
fun JsonElement?.asArray(): JsonArray? = this as? JsonArray

fun JsonObject.string(name: String): String {
    val value = this[name] ?: return ""
    return when (value) {
        is JsonPrimitive -> value.content
        JsonNull -> ""
        else -> value.toString()
    }
}

fun JsonObject.intOrNull(name: String): Int? {
    return (this[name] as? JsonPrimitive)?.content?.toIntOrNull()
}

fun JsonObject.obj(name: String): JsonObject? = this[name] as? JsonObject
fun JsonObject.arr(name: String): JsonArray = (this[name] as? JsonArray) ?: JsonArray(emptyList())

fun JsonObject.path(vararg keys: String): JsonElement? {
    var current: JsonElement = this
    for (key in keys) {
        val obj = current as? JsonObject ?: return null
        current = obj[key] ?: return null
    }
    return current
}
