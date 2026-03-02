package org.apptorney.android.data.model

data class HomeItem(
    val title: String,
    val summary: String,
    val type: String,
    val sourceId: String,
)

data class AreaOfLaw(
    val id: String,
    val name: String,
    val description: String,
)

data class LegislationTypeOption(
    val id: String,
    val name: String,
    val description: String,
)

data class Party(
    val id: String,
    val name: String,
)

data class Appearance(
    val id: String,
    val advocate: String,
    val lawFirm: String,
)

data class Citation(
    val description: String,
    val number: String,
    val year: Int?,
    val code: String,
    val pageNumber: Int?,
)

data class CaseSummary(
    val id: String,
    val name: String,
    val highlight: String,
    val summaryOfRuling: String,
    val areaOfLawName: String,
    val caseNumber: String,
    val citation: Citation,
)

data class CaseReference(
    val id: String,
    val name: String,
)

data class LegislationReference(
    val id: String,
    val name: String,
)

data class CaseDetail(
    val id: String,
    val name: String,
    val caseNumber: String,
    val areaOfLawName: String,
    val courtName: String,
    val jurisdictionName: String,
    val locationName: String,
    val coram: List<String>,
    val summaryOfFacts: String,
    val summaryOfRuling: String,
    val judgement: String,
    val citation: Citation,
    val caseReferences: List<CaseReference>,
    val legislationReferences: List<LegislationReference>,
)

data class LegislationSummary(
    val id: String,
    val name: String,
    val highlight: String,
    val preamble: String,
    val legislationType: String,
    val yearOfAmendment: Int?,
)

data class LegislationPart(
    val number: String,
    val title: String,
    val content: String,
    val flatContentNew: String,
    val subParts: List<LegislationPart>,
)

data class FlatLegislationPart(
    val number: String,
    val title: String,
    val content: String,
)

data class LegislationDetail(
    val id: String,
    val legislationName: String,
    val legislationType: String,
    val preamble: String,
    val enactment: String,
    val volumeNumber: String,
    val chapterNumber: String,
    val dateOfAssent: String,
    val yearOfAmendment: Int?,
    val parts: List<LegislationPart>,
)

data class ChatReference(
    val source: String,
    val id: String,
    val type: String,
    val title: String,
)

data class ChatThreadSummary(
    val id: String,
    val title: String,
    val updatedAt: String,
    val lastQuestion: String,
)

data class ChatMessage(
    val text: String,
    val isUser: Boolean,
    val references: List<ChatReference> = emptyList(),
)

data class AskAiResult(
    val answer: String,
    val references: List<ChatReference>,
    val threadId: String?,
)

sealed interface ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>
    data class Failure(
        val message: String,
        val statusCode: Int? = null,
        val cause: Throwable? = null,
    ) : ApiResult<Nothing>
}
