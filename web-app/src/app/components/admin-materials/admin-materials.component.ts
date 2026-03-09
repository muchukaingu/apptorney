import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminCaseFormData,
  AdminCaseListItem,
  AdminCaseListParams,
  AdminLegislationFormData,
  AdminLegislationListItem,
  AdminLegislationListParams,
  AdminMaterialsMeta
} from '../../models/admin-materials.models';
import { AdminService } from '../../services/admin.service';

type ResourceType = 'case' | 'legislation';
type PanelMode = 'empty' | 'view' | 'edit' | 'create';

@Component({
  selector: 'app-admin-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-materials.component.html',
  styleUrl: './admin-materials.component.css'
})
export class AdminMaterialsComponent implements OnInit {
  @Input() resourceType: ResourceType = 'case';

  meta: AdminMaterialsMeta | null = null;
  loading = true;
  detailLoading = false;
  saving = false;
  panelMode: PanelMode = 'empty';

  message = '';
  error = '';
  validationErrors: string[] = [];

  cases: AdminCaseListItem[] = [];
  legislations: AdminLegislationListItem[] = [];

  selectedCase: AdminCaseFormData | null = null;
  selectedLegislation: AdminLegislationFormData | null = null;

  caseForm = this.createEmptyCaseForm();
  legislationForm = this.createEmptyLegislationForm();

  caseFilters: AdminCaseListParams = {
    page: 1,
    limit: 20,
    search: '',
    courtId: '',
    areaOfLawId: '',
    year: '',
    completionStatus: 'all',
    primaryReview: 'all',
    isStub: 'all'
  };

  legislationFilters: AdminLegislationListParams = {
    page: 1,
    limit: 20,
    search: '',
    legislationTypeId: '',
    assentYear: '',
    hasAmendment: 'all',
    deletedState: 'active'
  };

  totalItems = 0;
  totalPages = 1;

  constructor(private readonly adminService: AdminService) {}

  async ngOnInit(): Promise<void> {
    await this.loadMeta();
    await this.loadList();
  }

  get title(): string {
    return this.resourceType === 'case' ? 'Case materials' : 'Legislation materials';
  }

  get subtitle(): string {
    return this.resourceType === 'case'
      ? 'Search, filter, review, and update case records from the full library.'
      : 'Manage legislation records with pagination, filters, and inline editing.';
  }

  get selectedTitle(): string {
    if (this.resourceType === 'case') {
      return this.selectedCase?.name || this.selectedCase?.caseNumber || 'Case details';
    }
    return this.selectedLegislation?.legislationName || 'Legislation details';
  }

  get searchPlaceholder(): string {
    return this.resourceType === 'case'
      ? 'Search by case name, appeal number, or citation...'
      : 'Search by legislation title, numbers, or preamble...';
  }

  get currentPage(): number {
    return this.resourceType === 'case' ? this.caseFilters.page : this.legislationFilters.page;
  }

  get hasItems(): boolean {
    return this.resourceType === 'case' ? this.cases.length > 0 : this.legislations.length > 0;
  }

  get listSummary(): string {
    const label = this.resourceType === 'case' ? 'cases' : 'legislations';
    return `${this.totalItems} ${label} found`;
  }

  async loadMeta(): Promise<void> {
    if (this.meta) {
      return;
    }

    const result = await this.adminService.getMaterialsMeta();
    if (!result.ok || !result.data) {
      this.error = 'Filter metadata could not be loaded.';
      return;
    }

    this.meta = result.data;
  }

  async loadList(resetPage = false): Promise<void> {
    this.loading = true;
    this.error = '';

    if (resetPage) {
      if (this.resourceType === 'case') {
        this.caseFilters.page = 1;
      } else {
        this.legislationFilters.page = 1;
      }
    }

    if (this.resourceType === 'case') {
      const result = await this.adminService.listCases(this.caseFilters);
      if (!result.ok || !result.data) {
        this.loading = false;
        this.error = 'Cases could not be loaded.';
        return;
      }

      this.cases = result.data.items;
      this.totalItems = result.data.total;
      this.totalPages = result.data.pages;
      this.loading = false;

      if (this.cases.length === 0 && this.panelMode !== 'create' && this.panelMode !== 'edit') {
        this.selectedCase = null;
        this.panelMode = 'empty';
      }
      return;
    }

    const result = await this.adminService.listLegislations(this.legislationFilters);
    if (!result.ok || !result.data) {
      this.loading = false;
      this.error = 'Legislations could not be loaded.';
      return;
    }

    this.legislations = result.data.items;
    this.totalItems = result.data.total;
    this.totalPages = result.data.pages;
    this.loading = false;

    if (this.legislations.length === 0 && this.panelMode !== 'create' && this.panelMode !== 'edit') {
      this.selectedLegislation = null;
      this.panelMode = 'empty';
    }
  }

  async refreshCurrentPage(): Promise<void> {
    await this.loadList(false);
  }

  async goToPage(page: number): Promise<void> {
    const safePage = Math.min(this.totalPages, Math.max(1, page));
    if (this.resourceType === 'case') {
      this.caseFilters.page = safePage;
    } else {
      this.legislationFilters.page = safePage;
    }

    await this.loadList(false);
  }

  async selectCase(id: string): Promise<void> {
    if (!id) {
      return;
    }

    this.detailLoading = true;
    this.panelMode = 'view';
    this.validationErrors = [];

    const result = await this.adminService.getCase(id);
    this.detailLoading = false;

    if (!result.ok || !result.data) {
      this.error = 'Case details could not be loaded.';
      return;
    }

    this.selectedCase = result.data;
    this.caseForm = this.cloneCaseForm(result.data);
  }

  async selectLegislation(id: string): Promise<void> {
    if (!id) {
      return;
    }

    this.detailLoading = true;
    this.panelMode = 'view';
    this.validationErrors = [];

    const result = await this.adminService.getLegislation(id);
    this.detailLoading = false;

    if (!result.ok || !result.data) {
      this.error = 'Legislation details could not be loaded.';
      return;
    }

    this.selectedLegislation = result.data;
    this.legislationForm = this.cloneLegislationForm(result.data);
  }

  openCreate(): void {
    this.message = '';
    this.error = '';
    this.validationErrors = [];
    this.panelMode = 'create';

    if (this.resourceType === 'case') {
      this.caseForm = this.createEmptyCaseForm();
      return;
    }

    this.legislationForm = this.createEmptyLegislationForm();
  }

  beginEdit(): void {
    this.message = '';
    this.error = '';
    this.validationErrors = [];
    this.panelMode = 'edit';

    if (this.resourceType === 'case' && this.selectedCase) {
      this.caseForm = this.cloneCaseForm(this.selectedCase);
    }

    if (this.resourceType === 'legislation' && this.selectedLegislation) {
      this.legislationForm = this.cloneLegislationForm(this.selectedLegislation);
    }
  }

  cancelEditing(): void {
    this.validationErrors = [];
    this.message = '';

    if (this.panelMode === 'create') {
      this.panelMode = this.resourceType === 'case'
        ? (this.selectedCase ? 'view' : 'empty')
        : (this.selectedLegislation ? 'view' : 'empty');
      return;
    }

    if (this.panelMode === 'edit') {
      this.panelMode = 'view';
      if (this.resourceType === 'case' && this.selectedCase) {
        this.caseForm = this.cloneCaseForm(this.selectedCase);
      }
      if (this.resourceType === 'legislation' && this.selectedLegislation) {
        this.legislationForm = this.cloneLegislationForm(this.selectedLegislation);
      }
    }
  }

  async save(): Promise<void> {
    this.message = '';
    this.error = '';
    this.validationErrors = this.resourceType === 'case' ? this.validateCaseForm() : this.validateLegislationForm();

    if (this.validationErrors.length > 0) {
      return;
    }

    this.saving = true;

    if (this.resourceType === 'case') {
      const result = this.panelMode === 'edit' && this.selectedCase?.id
        ? await this.adminService.updateCase(this.selectedCase.id, this.caseForm)
        : await this.adminService.createCase(this.caseForm);

      this.saving = false;

      if (!result.ok || !result.data) {
        this.error = result.message || 'Case could not be saved.';
        this.validationErrors = result.errors || [];
        return;
      }

      this.message = result.message || 'Case saved.';
      this.selectedCase = result.data;
      this.caseForm = this.cloneCaseForm(result.data);
      this.panelMode = 'view';
      await this.loadList(false);
      return;
    }

    const result = this.panelMode === 'edit' && this.selectedLegislation?.id
      ? await this.adminService.updateLegislation(this.selectedLegislation.id, this.legislationForm)
      : await this.adminService.createLegislation(this.legislationForm);

    this.saving = false;

    if (!result.ok || !result.data) {
      this.error = result.message || 'Legislation could not be saved.';
      this.validationErrors = result.errors || [];
      return;
    }

    this.message = result.message || 'Legislation saved.';
    this.selectedLegislation = result.data;
    this.legislationForm = this.cloneLegislationForm(result.data);
    this.panelMode = 'view';
    await this.loadList(false);
  }

  addParty(list: 'plaintiffs' | 'defendants'): void {
    this.caseForm[list].push({ name: '' });
  }

  removeParty(list: 'plaintiffs' | 'defendants', index: number): void {
    if (this.caseForm[list].length === 1) {
      this.caseForm[list][0] = { name: '' };
      return;
    }
    this.caseForm[list].splice(index, 1);
  }

  applyFilters(): void {
    void this.loadList(true);
  }

  clearFilters(): void {
    if (this.resourceType === 'case') {
      this.caseFilters = {
        page: 1,
        limit: 20,
        search: '',
        courtId: '',
        areaOfLawId: '',
        year: '',
        completionStatus: 'all',
        primaryReview: 'all',
        isStub: 'all'
      };
    } else {
      this.legislationFilters = {
        page: 1,
        limit: 20,
        search: '',
        legislationTypeId: '',
        assentYear: '',
        hasAmendment: 'all',
        deletedState: 'active'
      };
    }

    void this.loadList(true);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  partyNames(items: Array<{ name: string }>): string {
    return items
      .map((item) => item.name?.trim() || '')
      .filter((name) => !!name)
      .join(', ');
  }

  private validateCaseForm(): string[] {
    const errors: string[] = [];
    const form = this.caseForm;
    const hasIdentity = form.name.trim().length > 0 || form.caseNumber.trim().length > 0;

    if (!hasIdentity) {
      errors.push('Enter at least a case name or a case number.');
    }

    const citation = form.citation;
    const citationFieldsFilled = [citation.description, citation.number, citation.year, citation.code, citation.pageNumber]
      .some((value) => String(value).trim().length > 0);

    if (citationFieldsFilled) {
      if (!citation.description.trim()) {
        errors.push('Citation description is required when citation details are provided.');
      }
      if (!citation.year.trim()) {
        errors.push('Citation year is required when citation details are provided.');
      }
      if (!citation.code.trim()) {
        errors.push('Citation code is required when citation details are provided.');
      }
      if (!citation.pageNumber.trim()) {
        errors.push('Citation page number is required when citation details are provided.');
      }
    }

    return errors;
  }

  private validateLegislationForm(): string[] {
    const errors: string[] = [];
    if (!this.legislationForm.legislationName.trim()) {
      errors.push('Legislation name is required.');
    }
    return errors;
  }

  private createEmptyCaseForm(): AdminCaseFormData {
    return {
      id: '',
      name: '',
      caseNumber: '',
      appealNumber: '',
      courtId: '',
      areaOfLawId: '',
      courtName: '',
      areaOfLawName: '',
      citation: {
        description: '',
        number: '',
        year: '',
        code: '',
        pageNumber: ''
      },
      plaintiffs: [{ name: '' }],
      defendants: [{ name: '' }],
      summaryOfFacts: '',
      summaryOfRuling: '',
      judgement: '',
      notes: '',
      completionStatus: false,
      primaryReview: false,
      secondayReview: false,
      isStub: false,
      reported: false
    };
  }

  private createEmptyLegislationForm(): AdminLegislationFormData {
    return {
      id: '',
      legislationName: '',
      generalTitle: '',
      chapterNumber: '',
      legislationNumber: '',
      legislationNumbers: '',
      legislationTypeId: '',
      legislationTypeName: '',
      volumeNumber: '',
      dateOfAssent: '',
      yearOfAmendment: '',
      preamble: '',
      enactment: '',
      deleted: false
    };
  }

  private cloneCaseForm(source: AdminCaseFormData): AdminCaseFormData {
    return {
      ...source,
      citation: { ...source.citation },
      plaintiffs: source.plaintiffs.map((item) => ({ ...item })),
      defendants: source.defendants.map((item) => ({ ...item }))
    };
  }

  private cloneLegislationForm(source: AdminLegislationFormData): AdminLegislationFormData {
    return { ...source };
  }
}
