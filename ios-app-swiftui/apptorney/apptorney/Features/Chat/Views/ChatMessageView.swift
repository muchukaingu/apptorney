import SwiftUI

struct ChatMessageView: View {
    let message: ChatMessage
    var isStreaming: Bool = false

    var body: some View {
        HStack(alignment: .top) {
            if message.isUser { Spacer(minLength: 60) }

            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 8) {
                if message.isUser {
                    Text(message.text)
                        .font(.system(size: 17, weight: .light))
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .background(Color.black)
                        .cornerRadius(16)
                } else {
                    if !message.text.isEmpty {
                        AIMessageTextView(
                            text: message.text,
                            references: message.references,
                            showReferences: !isStreaming
                        )
                    }
                }
            }
            .frame(maxWidth: message.isUser ? UIScreen.main.bounds.width * 0.78 : .infinity, alignment: message.isUser ? .trailing : .leading)

            if !message.isUser { Spacer(minLength: 0) }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, message.isUser ? 4 : 2)
    }
}

// MARK: - AI Message with Superscript References

struct AIMessageTextView: View {
    let text: String
    let references: [ChatReference]
    let showReferences: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Main content with inline superscripts
            ForEach(Array(parseBlocks().enumerated()), id: \.offset) { _, block in
                switch block {
                case .heading(let level, let content):
                    inlineText(content)
                        .font(.system(size: headingSize(level), weight: .bold))
                        .foregroundColor(.black)
                        .padding(.top, level == 1 ? 8 : 4)

                case .bullet(let content):
                    HStack(alignment: .top, spacing: 8) {
                        Text("\u{2022}")
                            .font(.system(size: 17, weight: .medium))
                            .foregroundColor(.black)
                        inlineText(content)
                    }

                case .numbered(let num, let content):
                    HStack(alignment: .top, spacing: 8) {
                        Text("\(num).")
                            .font(.system(size: 17, weight: .medium))
                            .foregroundColor(.black)
                            .frame(minWidth: 20, alignment: .trailing)
                        inlineText(content)
                    }

                case .paragraph(let content):
                    inlineText(content)

                case .empty:
                    Spacer().frame(height: 4)
                }
            }

            // References section — after all text, only when not streaming
            if showReferences && !references.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    Text("References")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(.black)
                        .padding(.top, 12)

                    ForEach(Array(references.enumerated()), id: \.element.id) { index, ref in
                        NavigationLink {
                            referenceDestination(ref)
                        } label: {
                            HStack(alignment: .top, spacing: 8) {
                                SuperscriptBadge(number: index + 1)

                                Text(titleCased(ref.title))
                                    .font(.system(size: 17))
                                    .foregroundColor(.black)
                                    .lineLimit(2)
                                    .multilineTextAlignment(.leading)
                            }
                        }
                    }
                }
            }
        }
    }

    // MARK: - Inline Text with Superscript Badges

    @ViewBuilder
    private func inlineText(_ input: String) -> some View {
        let segments = parseInlineSegments(input)
        // Build a flow of Text views with superscript badges
        segments.reduce(Text("")) { result, segment in
            switch segment {
            case .text(let content):
                return result + renderMarkdownInline(content)
            case .reference(let number):
                return result + Text(superscriptImage(number: number))
            }
        }
        .font(.system(size: 17, weight: .light))
        .foregroundColor(.black)
        .lineSpacing(2)
    }

    // MARK: - Superscript Badge Image

    private func superscriptImage(number: Int) -> AttributedString {
        // Use Unicode superscript digits with circle indicator
        let superDigits: [Character] = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"]
        let numStr = String(number)
        let superStr = numStr.map { char -> Character in
            if let digit = char.wholeNumberValue, digit < superDigits.count {
                return superDigits[digit]
            }
            return char
        }
        var attr = AttributedString(String(superStr))
        attr.font = .system(size: 11, weight: .bold)
        attr.foregroundColor = .gray
        attr.baselineOffset = 6
        return attr
    }

    // MARK: - Inline Markdown (bold, italic, code)

    private func renderMarkdownInline(_ input: String) -> Text {
        if let attributed = try? AttributedString(
            markdown: input,
            options: .init(interpretedSyntax: .inlineOnlyPreservingWhitespace)
        ) {
            var result = attributed
            result.font = .system(size: 17, weight: .light)
            result.foregroundColor = .black
            for run in result.runs {
                if let intent = run.inlinePresentationIntent {
                    var container = AttributeContainer()
                    if intent.contains(.stronglyEmphasized) && intent.contains(.emphasized) {
                        container.font = .system(size: 17, weight: .semibold).italic()
                    } else if intent.contains(.stronglyEmphasized) {
                        container.font = .system(size: 17, weight: .semibold)
                    } else if intent.contains(.emphasized) {
                        container.font = .system(size: 17, weight: .light).italic()
                    }
                    if intent.contains(.code) {
                        container.font = .system(size: 15, design: .monospaced)
                        container.backgroundColor = Color(white: 0.93)
                    }
                    result[run.range].mergeAttributes(container)
                }
            }
            return Text(result)
        }
        return Text(input)
    }

    // MARK: - Parse Inline Segments (text vs [S1] references)

    private enum InlineSegment {
        case text(String)
        case reference(Int)
    }

    private func parseInlineSegments(_ input: String) -> [InlineSegment] {
        var segments: [InlineSegment] = []
        var remaining = input

        // Match [S1], [s1], [S12], etc. — case insensitive
        while let matchRange = remaining.range(of: #"\[[sS](\d+)\]"#, options: .regularExpression) {
            // Text before the tag
            let before = String(remaining[remaining.startIndex..<matchRange.lowerBound])
            if !before.isEmpty {
                segments.append(.text(before))
            }

            // Extract the number from the matched tag
            let matched = String(remaining[matchRange])
            let digits = matched.filter { $0.isNumber }
            if let number = Int(digits) {
                segments.append(.reference(number))
            } else {
                segments.append(.text(matched))
            }

            remaining = String(remaining[matchRange.upperBound...])
        }

        if !remaining.isEmpty {
            segments.append(.text(remaining))
        }

        return segments
    }

    // MARK: - Block Parsing

    private enum MarkdownBlock {
        case heading(Int, String)
        case bullet(String)
        case numbered(Int, String)
        case paragraph(String)
        case empty
    }

    private func parseBlocks() -> [MarkdownBlock] {
        let lines = text.components(separatedBy: "\n")
        var blocks: [MarkdownBlock] = []
        var paragraphBuffer = ""

        func flushParagraph() {
            let trimmed = paragraphBuffer.trimmingCharacters(in: .whitespacesAndNewlines)
            if !trimmed.isEmpty {
                blocks.append(.paragraph(trimmed))
            }
            paragraphBuffer = ""
        }

        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)

            if trimmed.isEmpty {
                flushParagraph()
                blocks.append(.empty)
                continue
            }

            // Headings
            if trimmed.hasPrefix("#") {
                let hashes = trimmed.prefix(while: { $0 == "#" })
                let rest = trimmed.dropFirst(hashes.count).trimmingCharacters(in: .whitespaces)
                if hashes.count <= 6 && !rest.isEmpty {
                    flushParagraph()
                    blocks.append(.heading(hashes.count, rest))
                    continue
                }
            }

            // Bullet points
            if (trimmed.hasPrefix("- ") || trimmed.hasPrefix("* ")) && trimmed.count > 2 {
                flushParagraph()
                let content = String(trimmed.dropFirst(2))
                blocks.append(.bullet(content))
                continue
            }

            // Numbered lists
            if let dotIndex = trimmed.firstIndex(of: "."),
               dotIndex < trimmed.endIndex,
               let num = Int(trimmed[trimmed.startIndex..<dotIndex]),
               trimmed.index(after: dotIndex) < trimmed.endIndex,
               trimmed[trimmed.index(after: dotIndex)] == " " {
                flushParagraph()
                let content = String(trimmed[trimmed.index(dotIndex, offsetBy: 2)...])
                blocks.append(.numbered(num, content))
                continue
            }

            // Regular text
            if paragraphBuffer.isEmpty {
                paragraphBuffer = trimmed
            } else {
                paragraphBuffer += " " + trimmed
            }
        }

        flushParagraph()
        return blocks
    }

    // MARK: - Helpers

    private func headingSize(_ level: Int) -> CGFloat {
        switch level {
        case 1: return 22
        case 2: return 20
        case 3: return 18
        default: return 17
        }
    }

    private func titleCased(_ title: String) -> String {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return title }
        return trimmed.lowercased().capitalized
    }

    @ViewBuilder
    private func referenceDestination(_ ref: ChatReference) -> some View {
        if ref.type == "case" {
            CaseDetailView(caseId: ref.sourceId)
        } else {
            LegislationDetailView(legislationId: ref.sourceId)
        }
    }
}

// MARK: - Superscript Badge View (for reference list)

struct SuperscriptBadge: View {
    let number: Int

    var body: some View {
        Text("\(number)")
            .font(.system(size: 10, weight: .semibold))
            .foregroundColor(.black)
            .frame(width: 18, height: 18)
            .background(Color(white: 0.82))
            .clipShape(Circle())
    }
}
