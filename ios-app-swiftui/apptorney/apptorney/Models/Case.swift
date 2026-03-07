import Foundation

struct LegalCase: Codable, Identifiable {
    var id: String { _id ?? "" }
    var _id: String?
    var referenceNumber: String?
    var name: String?
    var caseNumber: String?
    var highlight: String?
    var plaintiffs: [Party]?
    var defendants: [Party]?
    var appearancesForPlaintiffs: [Appearance]?
    var appearancesForDefendants: [Appearance]?
    var coram: [Coram]?
    var citation: Citation?
    var summaryOfFacts: String?
    var summaryOfRuling: String?
    var judgement: String?
    var court: Court?
    var courtDivision: Division?
    var location: Location?
    var jurisdiction: Jurisdiction?
    var areaOfLaw: AreaOfLaw?
    var workReferedTo: [WorkReference]?
    var legislationsReferedTo: [Legislation]?
    var casesReferedTo: [LegalCase]?
}
