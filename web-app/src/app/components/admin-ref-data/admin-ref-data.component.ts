import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RefDataConfig, RefDataDivision, RefDataItem } from '../../models/admin-ref-data.models';
import { AdminRefDataService } from '../../services/admin-ref-data.service';

@Component({
  selector: 'app-admin-ref-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-ref-data.component.html',
  styleUrl: './admin-ref-data.component.css'
})
export class AdminRefDataComponent implements OnInit, OnChanges {
  @Input() config!: RefDataConfig;

  items: RefDataItem[] = [];
  loading = false;
  saving = false;
  page = 1;
  totalPages = 1;
  totalItems = 0;
  search = '';
  showDeleted = false;
  error = '';
  message = '';

  modalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  formValue = '';
  formDeleted = false;
  editingItem: RefDataItem | null = null;

  divisions: RefDataDivision[] = [];
  newDivisionName = '';
  divisionLoading = false;
  divisionSaving = false;

  private loadSeq = 0;

  constructor(private readonly refDataService: AdminRefDataService) {}

  async ngOnInit(): Promise<void> {
    await this.loadList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.resetState();
      void this.loadList();
    }
  }

  get fieldLabel(): string {
    return this.config.fieldName === 'synonym' ? 'Synonym' : 'Name';
  }

  displayValue(item: RefDataItem): string {
    return (item as any)[this.config.fieldName] ?? '';
  }

  async loadList(): Promise<void> {
    const seq = ++this.loadSeq;
    this.loading = true;
    this.error = '';
    this.message = '';

    const result = await this.refDataService.list(this.config.apiPath, {
      page: this.page,
      limit: 20,
      search: this.search,
      showDeleted: this.showDeleted
    });

    if (seq !== this.loadSeq) return;

    this.loading = false;

    if (!result.ok || !result.data) {
      this.error = 'Could not load ' + this.config.labelPlural.toLowerCase() + '.';
      return;
    }

    this.items = result.data.items;
    this.totalItems = result.data.total;
    this.totalPages = result.data.pages;
  }

  resetAndLoad(): void {
    this.page = 1;
    void this.loadList();
  }

  refresh(): void {
    void this.loadList();
  }

  async goToPage(newPage: number): Promise<void> {
    this.page = Math.min(this.totalPages, Math.max(1, newPage));
    await this.loadList();
  }

  openCreate(): void {
    this.formValue = '';
    this.formDeleted = false;
    this.editingItem = null;
    this.modalMode = 'create';
    this.modalOpen = true;
    this.error = '';
    this.message = '';
    this.divisions = [];
    this.newDivisionName = '';
  }

  async openEdit(item: RefDataItem): Promise<void> {
    this.formValue = (item as any)[this.config.fieldName] ?? '';
    this.formDeleted = item.deleted;
    this.editingItem = item;
    this.modalMode = 'edit';
    this.modalOpen = true;
    this.error = '';
    this.message = '';

    if (this.config.hasDivisions) {
      await this.loadDivisions(item.id);
    }
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingItem = null;
    this.divisions = [];
    this.newDivisionName = '';
  }

  async save(): Promise<void> {
    const value = this.formValue.trim();
    if (!value) {
      this.error = this.fieldLabel + ' is required.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    try {
      const result = this.modalMode === 'create'
        ? await this.refDataService.create(this.config.apiPath, this.config.fieldName, value)
        : this.editingItem
          ? await this.refDataService.update(this.config.apiPath, this.editingItem.id, this.config.fieldName, value, this.formDeleted)
          : { ok: false, message: 'No record selected.' };

      if (!result.ok) {
        this.error = result.message || 'Could not save.';
        return;
      }

      this.message = result.message || 'Saved.';
      this.closeModal();
      await this.loadList();
    } finally {
      this.saving = false;
    }
  }

  async archiveItem(item: RefDataItem): Promise<void> {
    this.error = '';
    this.message = '';

    const result = await this.refDataService.softDelete(this.config.apiPath, item.id);
    if (!result.ok) {
      this.error = result.message || 'Could not archive.';
      return;
    }

    this.message = result.message || 'Archived.';
    await this.loadList();
  }

  async restoreItem(item: RefDataItem): Promise<void> {
    this.error = '';
    this.message = '';

    const result = await this.refDataService.restore(this.config.apiPath, item.id);
    if (!result.ok) {
      this.error = result.message || 'Could not restore.';
      return;
    }

    this.message = result.message || 'Restored.';
    await this.loadList();
  }

  // Division management (courts only)

  async loadDivisions(courtId: string): Promise<void> {
    this.divisionLoading = true;
    const result = await this.refDataService.listDivisions(courtId);
    this.divisionLoading = false;
    this.divisions = result.ok && result.data ? result.data : [];
  }

  async addDivision(): Promise<void> {
    const name = this.newDivisionName.trim();
    if (!name || !this.editingItem) return;

    this.divisionSaving = true;
    const result = await this.refDataService.createDivision(this.editingItem.id, name);
    this.divisionSaving = false;

    if (!result.ok) {
      this.error = result.message || 'Could not add division.';
      return;
    }

    this.newDivisionName = '';
    await this.loadDivisions(this.editingItem.id);
  }

  async removeDivision(divisionId: string): Promise<void> {
    if (!this.editingItem) return;

    const result = await this.refDataService.deleteDivision(this.editingItem.id, divisionId);
    if (!result.ok) {
      this.error = result.message || 'Could not remove division.';
      return;
    }

    await this.loadDivisions(this.editingItem.id);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  private resetState(): void {
    this.items = [];
    this.page = 1;
    this.totalPages = 1;
    this.totalItems = 0;
    this.search = '';
    this.showDeleted = false;
    this.error = '';
    this.message = '';
    this.modalOpen = false;
    this.editingItem = null;
    this.divisions = [];
    this.loadSeq = 0;
  }
}
