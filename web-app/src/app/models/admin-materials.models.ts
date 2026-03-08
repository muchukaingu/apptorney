export interface AdminOption {
  id: string;
  name: string;
}

export interface AdminMaterialsMeta {
  cases: {
    courts: AdminOption[];
    areasOfLaw: AdminOption[];
  };
  legislations: {
    types: AdminOption[];
  };
}

export interface AdminPagedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminCaseListParams {
  page: number;
  limit: number;
  search: string;
  courtId: string;
  areaOfLawId: string;
  year: string;
  completionStatus: string;
  primaryReview: string;
  isStub: string;
}

export interface AdminLegislationListParams {
  page: number;
  limit: number;
  search: string;
  legislationTypeId: string;
  assentYear: string;
  hasAmendment: string;
  deletedState: string;
}

export interface AdminCaseListItem {
  id: string;
  name: string;
  caseNumber: string;
  appealNumber: string;
  citationLabel: string;
  courtId: string;
  courtName: string;
  areaOfLawId: string;
  areaOfLawName: string;
  completionStatus: boolean;
  primaryReview: boolean;
  isStub: boolean;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLegislationListItem {
  id: string;
  legislationName: string;
  generalTitle: string;
  chapterNumber: string;
  legislationNumber: string;
  legislationNumbers: string;
  legislationTypeId: string;
  legislationTypeName: string;
  volumeNumber: string;
  yearOfAmendment: number | null;
  dateOfAssent: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCaseFormData {
  id: string;
  name: string;
  caseNumber: string;
  appealNumber: string;
  courtId: string;
  areaOfLawId: string;
  courtName: string;
  areaOfLawName: string;
  citation: {
    description: string;
    number: string;
    year: string;
    code: string;
    pageNumber: string;
  };
  plaintiffs: Array<{ name: string }>;
  defendants: Array<{ name: string }>;
  summaryOfFacts: string;
  summaryOfRuling: string;
  judgement: string;
  notes: string;
  completionStatus: boolean;
  primaryReview: boolean;
  secondayReview: boolean;
  isStub: boolean;
  reported: boolean;
}

export interface AdminLegislationFormData {
  id: string;
  legislationName: string;
  generalTitle: string;
  chapterNumber: string;
  legislationNumber: string;
  legislationNumbers: string;
  legislationTypeId: string;
  legislationTypeName: string;
  volumeNumber: string;
  dateOfAssent: string;
  yearOfAmendment: string;
  preamble: string;
  enactment: string;
  deleted: boolean;
}
