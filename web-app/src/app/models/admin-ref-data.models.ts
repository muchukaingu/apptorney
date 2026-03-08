export type AdminSection =
  | 'dashboard'
  | 'courts'
  | 'jurisdictions'
  | 'locations'
  | 'areasOfLaw'
  | 'legislationTypes'
  | 'partTypes'
  | 'plaintiffSynonyms'
  | 'defendantSynonyms';

export interface RefDataConfig {
  entityKey: AdminSection;
  label: string;
  labelPlural: string;
  apiPath: string;
  fieldName: 'name' | 'synonym';
  hasDivisions: boolean;
}

export interface RefDataItem {
  id: string;
  name?: string;
  synonym?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RefDataDivision {
  id: string;
  name: string;
  courtId: string;
}

export interface RefDataListParams {
  page: number;
  limit: number;
  search: string;
  showDeleted: boolean;
}

export interface RefDataPagedResult {
  items: RefDataItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const ADMIN_REF_DATA_CONFIGS: Record<Exclude<AdminSection, 'dashboard'>, RefDataConfig> = {
  courts: {
    entityKey: 'courts',
    label: 'Court',
    labelPlural: 'Courts',
    apiPath: '/admin/reference/courts',
    fieldName: 'name',
    hasDivisions: true
  },
  jurisdictions: {
    entityKey: 'jurisdictions',
    label: 'Jurisdiction',
    labelPlural: 'Jurisdictions',
    apiPath: '/admin/reference/jurisdictions',
    fieldName: 'name',
    hasDivisions: false
  },
  locations: {
    entityKey: 'locations',
    label: 'Location',
    labelPlural: 'Locations',
    apiPath: '/admin/reference/locations',
    fieldName: 'name',
    hasDivisions: false
  },
  areasOfLaw: {
    entityKey: 'areasOfLaw',
    label: 'Area of Law',
    labelPlural: 'Areas of Law',
    apiPath: '/admin/reference/areas-of-law',
    fieldName: 'name',
    hasDivisions: false
  },
  legislationTypes: {
    entityKey: 'legislationTypes',
    label: 'Legislation Type',
    labelPlural: 'Legislation Types',
    apiPath: '/admin/reference/legislation-types',
    fieldName: 'name',
    hasDivisions: false
  },
  partTypes: {
    entityKey: 'partTypes',
    label: 'Part Type',
    labelPlural: 'Legislation Part Types',
    apiPath: '/admin/reference/part-types',
    fieldName: 'name',
    hasDivisions: false
  },
  plaintiffSynonyms: {
    entityKey: 'plaintiffSynonyms',
    label: 'Plaintiff Synonym',
    labelPlural: 'Plaintiff Synonyms',
    apiPath: '/admin/reference/plaintiff-synonyms',
    fieldName: 'synonym',
    hasDivisions: false
  },
  defendantSynonyms: {
    entityKey: 'defendantSynonyms',
    label: 'Defendant Synonym',
    labelPlural: 'Defendant Synonyms',
    apiPath: '/admin/reference/defendant-synonyms',
    fieldName: 'synonym',
    hasDivisions: false
  }
};
