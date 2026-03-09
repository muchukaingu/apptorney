# Reference Data List-Detail + Dark Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert admin-ref-data from table+modal to card list+detail panel (matching admin-materials pattern), and add dark mode support to all three admin components.

**Architecture:** The ref-data component will adopt the same 2-column shell layout already used by admin-materials (`grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr)`). Cards replace table rows, an inline detail panel replaces the modal overlay. Dark mode is added via `@media (prefers-color-scheme: dark)` blocks that remap each component's custom properties.

**Tech Stack:** Angular 19 standalone components, CSS custom properties, no new dependencies.

---

### Task 1: Add dark mode to admin-dashboard

**Files:**
- Modify: `web-app/src/app/components/admin-dashboard/admin-dashboard.component.css`

**Step 1: Add dark mode media query block**

Append before the existing `@media (max-width: 1160px)` rule (around line 599):

```css
@media (prefers-color-scheme: dark) {
  .ops-dashboard {
    --dashboard-ink: #e8e8e8;
    --dashboard-muted: #999999;
    --dashboard-line: #333333;
    --dashboard-paper: #1a1a1a;
    --dashboard-surface: #222222;
    --dashboard-accent: #7fbfb5;
    --dashboard-accent-soft: #1e2e2b;
    --dashboard-warm: #c4977d;
    --dashboard-neutral: #a0a09a;
  }

  .admin-dashboard__banner {
    border-color: #5c3a2a;
    background: #2d1e15;
    color: #d4a088;
  }

  .skeleton-line,
  .skeleton-metric,
  .skeleton-chip,
  .skeleton-bar,
  .skeleton-chart__area,
  .skeleton-activity__item,
  .skeleton-payment {
    background: linear-gradient(90deg, #2a2a2a 0%, #333333 50%, #2a2a2a 100%);
    background-size: 220% 100%;
  }

  .dashboard-bar__track {
    background: #333333;
  }
}
```

**Step 2: Verify visually**

Run: Open browser with dark mode preference, navigate to admin dashboard, confirm colors are dark-themed.

**Step 3: Commit**

```bash
git add web-app/src/app/components/admin-dashboard/admin-dashboard.component.css
git commit -m "feat: add dark mode support to admin dashboard"
```

---

### Task 2: Add dark mode to admin-materials

**Files:**
- Modify: `web-app/src/app/components/admin-materials/admin-materials.component.css`

**Step 1: Add dark mode media query block**

Append before the existing `@media (max-width: 1180px)` rule:

```css
@media (prefers-color-scheme: dark) {
  .materials-admin {
    --materials-ink: #e8e8e8;
    --materials-muted: #999999;
    --materials-paper: #1a1a1a;
    --materials-surface: #222222;
    --materials-line: #333333;
    --materials-accent: #7fbfb5;
    --materials-accent-soft: #1e2e2b;
    --materials-warm: #c4977d;
  }

  .materials-admin__banner--success {
    background: #1a2e25;
    color: #7fbfb5;
    border-color: #2a4a3e;
  }

  .materials-admin__banner--error,
  .materials-panel__validation {
    background: #2d1e15;
    color: #d4a088;
    border-color: #5c3a2a;
  }

  .materials-admin__loading-row {
    background: linear-gradient(90deg, #2a2a2a 0%, #333333 50%, #2a2a2a 100%);
    background-size: 220% 100%;
  }

  .materials-admin__action--primary,
  .materials-admin__filter-actions button:not(.is-secondary),
  .materials-panel__actions button,
  .materials-form__section-header button:not(.is-secondary) {
    border-color: #e8e8e8;
    background: #e8e8e8;
    color: #111111;
  }

  .materials-admin__badge.is-quiet {
    background: #2a2a2a;
    color: #999999;
  }

  .materials-admin__badge--ghost {
    background: #2d1e15;
    color: #c4977d;
  }

  .materials-admin__filters input:focus,
  .materials-admin__filters select:focus,
  .materials-form input:focus,
  .materials-form select:focus,
  .materials-form textarea:focus {
    border-color: #555555;
    box-shadow: 0 0 0 3px rgba(127, 191, 181, 0.12);
  }
}
```

**Step 2: Verify visually**

Run: Open browser with dark mode, navigate to admin materials page, confirm dark theme.

**Step 3: Commit**

```bash
git add web-app/src/app/components/admin-materials/admin-materials.component.css
git commit -m "feat: add dark mode support to admin materials"
```

---

### Task 3: Convert ref-data to list-detail layout — HTML

**Files:**
- Modify: `web-app/src/app/components/admin-ref-data/admin-ref-data.component.html`

**Step 1: Replace entire template**

The new template replaces the table and modal with a 2-column shell (card list + inline detail panel). Key changes:
- `<table>` becomes card list with `.ref-data__row` buttons (same pattern as admin-materials)
- Modal overlay becomes `.ref-data-panel` inline sidebar
- All existing features preserved: search, pagination, archive/restore, divisions

```html
<section class="ref-data">
  <div class="ref-data__header">
    <div class="ref-data__header-actions">
      <button class="ref-data__action ref-data__action--primary" type="button" (click)="openCreate()">
        New {{ config.label.toLowerCase() }}
      </button>
      <button class="ref-data__action" type="button" (click)="refresh()">
        Refresh
      </button>
    </div>
  </div>

  <div *ngIf="message" class="ref-data__banner ref-data__banner--success">
    {{ message }}
  </div>

  <div *ngIf="error && !panelOpen" class="ref-data__banner ref-data__banner--error">
    {{ error }}
  </div>

  <div class="ref-data__shell" [class.ref-data__shell--list-only]="!panelOpen">
    <!-- List side -->
    <div class="ref-data__list">
      <div class="ref-data__toolbar">
        <label class="ref-data__search">
          <input
            type="search"
            [placeholder]="'Search ' + config.labelPlural.toLowerCase() + '...'"
            [(ngModel)]="search"
            (keyup.enter)="resetAndLoad()"
          />
        </label>

        <label class="ref-data__toggle">
          <input type="checkbox" [(ngModel)]="showDeleted" (ngModelChange)="resetAndLoad()" />
          <span>Show archived</span>
        </label>

        <button class="ref-data__action" type="button" (click)="resetAndLoad()">Search</button>
      </div>

      <div class="ref-data__results-meta">
        <strong>{{ totalItems }} {{ totalItems === 1 ? config.label.toLowerCase() : config.labelPlural.toLowerCase() }} found</strong>
        <span>Page {{ page }} of {{ totalPages }}</span>
      </div>

      <div *ngIf="loading" class="ref-data__loading">
        <div class="ref-data__loading-row" *ngFor="let _ of [1, 2, 3, 4, 5]"></div>
      </div>

      <div *ngIf="!loading && items.length === 0" class="ref-data__empty">
        <h4>No {{ config.labelPlural.toLowerCase() }} found</h4>
        <p>Try a different search, toggle archived records, or create a new one.</p>
      </div>

      <div class="ref-data__rows" *ngIf="!loading && items.length > 0">
        <button
          *ngFor="let item of items; trackBy: trackById"
          type="button"
          class="ref-data__row"
          [class.is-archived]="item.deleted"
          [class.is-selected]="editingItem?.id === item.id"
          (click)="openEdit(item)"
        >
          <div class="ref-data__row-main">
            <h4>{{ displayValue(item) }}</h4>
          </div>
          <div class="ref-data__row-side">
            <span class="ref-data__badge" [class.ref-data__badge--archived]="item.deleted">
              {{ item.deleted ? 'Archived' : 'Active' }}
            </span>
          </div>
        </button>
      </div>

      <div class="ref-data__pagination" *ngIf="totalPages > 1">
        <button type="button" [disabled]="page <= 1" (click)="goToPage(page - 1)">Prev</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button type="button" [disabled]="page >= totalPages" (click)="goToPage(page + 1)">Next</button>
      </div>
    </div>

    <!-- Detail panel -->
    <div class="ref-data-panel" *ngIf="panelOpen">
      <header class="ref-data-panel__header">
        <div>
          <p class="ref-data-panel__eyebrow">{{ panelMode === 'create' ? 'New' : 'Edit' }}</p>
          <h4>{{ panelMode === 'create' ? ('New ' + config.label.toLowerCase()) : displayValue(editingItem!) }}</h4>
        </div>
        <button type="button" class="ref-data-panel__close" (click)="closePanel()" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </header>

      <div *ngIf="error && panelOpen" class="ref-data__banner ref-data__banner--error ref-data__banner--panel">
        {{ error }}
      </div>

      <div class="ref-data-panel__content">
        <label class="ref-data-panel__field">
          <span>{{ fieldLabel }}</span>
          <input type="text" [(ngModel)]="formValue" [placeholder]="'Enter ' + fieldLabel.toLowerCase()" (keyup.enter)="save()" />
        </label>

        <label *ngIf="panelMode === 'edit'" class="ref-data-panel__toggle-field">
          <input type="checkbox" [(ngModel)]="formDeleted" />
          <span>Archived</span>
        </label>

        <!-- Court Divisions sub-section -->
        <div *ngIf="config.hasDivisions && panelMode === 'edit'" class="ref-data-panel__divisions">
          <h5>Court Divisions</h5>

          <div *ngIf="divisionLoading" class="ref-data-panel__divisions-loading">Loading divisions...</div>

          <div *ngIf="!divisionLoading && divisions.length === 0" class="ref-data-panel__divisions-empty">
            No divisions yet.
          </div>

          <ul *ngIf="!divisionLoading && divisions.length > 0" class="ref-data-panel__division-list">
            <li *ngFor="let div of divisions; trackBy: trackById">
              <span>{{ div.name }}</span>
              <button type="button" class="ref-data__row-action ref-data__row-action--danger" (click)="removeDivision(div.id)">Remove</button>
            </li>
          </ul>

          <div class="ref-data-panel__division-add">
            <input type="text" placeholder="New division name" [(ngModel)]="newDivisionName" (keyup.enter)="addDivision()" />
            <button type="button" class="ref-data__action" [disabled]="divisionSaving || !newDivisionName.trim()" (click)="addDivision()">
              {{ divisionSaving ? 'Adding...' : 'Add' }}
            </button>
          </div>
        </div>
      </div>

      <footer class="ref-data-panel__footer">
        <button type="button" class="ref-data__action ref-data__action--primary" [disabled]="saving" (click)="save()">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <div class="ref-data-panel__footer-secondary">
          <button *ngIf="panelMode === 'edit' && !editingItem?.deleted" type="button" class="ref-data__action ref-data__action--danger" (click)="archiveItem(editingItem!)">
            Archive
          </button>
          <button *ngIf="panelMode === 'edit' && editingItem?.deleted" type="button" class="ref-data__action" (click)="restoreItem(editingItem!)">
            Restore
          </button>
          <button type="button" class="ref-data__action" [disabled]="saving" (click)="closePanel()">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</section>
```

---

### Task 4: Convert ref-data to list-detail layout — TypeScript

**Files:**
- Modify: `web-app/src/app/components/admin-ref-data/admin-ref-data.component.ts`

**Step 1: Rename modal properties to panel properties**

Replace the modal-related properties and methods. The logic stays the same, only naming changes:

- `modalOpen` → `panelOpen`
- `modalMode` → `panelMode`
- `openCreate()` — change `this.modalOpen = true` to `this.panelOpen = true`
- `openEdit()` — change `this.modalOpen = true` to `this.panelOpen = true`
- `closeModal()` → `closePanel()` — change `this.modalOpen = false` to `this.panelOpen = false`
- In `save()` — change `this.closeModal()` to `this.closePanel()`
- In `resetState()` — change `this.modalOpen = false` to `this.panelOpen = false`

Full property replacements:

```typescript
// Replace these properties:
panelOpen = false;
panelMode: 'create' | 'edit' = 'create';

// Replace openCreate():
openCreate(): void {
  this.formValue = '';
  this.formDeleted = false;
  this.editingItem = null;
  this.panelMode = 'create';
  this.panelOpen = true;
  this.error = '';
  this.message = '';
  this.divisions = [];
  this.newDivisionName = '';
}

// Replace openEdit():
async openEdit(item: RefDataItem): Promise<void> {
  this.formValue = (item as any)[this.config.fieldName] ?? '';
  this.formDeleted = item.deleted;
  this.editingItem = item;
  this.panelMode = 'edit';
  this.panelOpen = true;
  this.error = '';
  this.message = '';

  if (this.config.hasDivisions) {
    await this.loadDivisions(item.id);
  }
}

// Rename closeModal → closePanel:
closePanel(): void {
  this.panelOpen = false;
  this.editingItem = null;
  this.divisions = [];
  this.newDivisionName = '';
}

// In save(), replace this.closeModal() with this.closePanel()
// In resetState(), replace this.modalOpen = false with this.panelOpen = false
```

---

### Task 5: Convert ref-data to list-detail layout — CSS

**Files:**
- Modify: `web-app/src/app/components/admin-ref-data/admin-ref-data.component.css`

**Step 1: Replace entire CSS file**

The new CSS follows the admin-materials pattern: 2-column grid shell, card-style rows, inline panel instead of modal overlay. All modal CSS is removed.

```css
:host {
  display: block;
}

.ref-data {
  padding: 28px 20px 40px;
  display: grid;
  gap: 20px;
}

.ref-data__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.ref-data__header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.ref-data__action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 15px;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 999px;
  background: var(--surface, #fff);
  color: var(--ink, #1a1a1a);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.ref-data__action:hover {
  border-color: #d8d0c3;
  background: var(--surface-hover, #f5f5f5);
}

.ref-data__action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ref-data__action--primary {
  background: var(--ink, #1a1a1a);
  color: var(--surface, #fff);
  border-color: transparent;
}

.ref-data__action--primary:hover {
  opacity: 0.85;
}

.ref-data__action--danger {
  color: #c62828;
  border-color: #e0b4b4;
}

.ref-data__action--danger:hover {
  background: #fbe9e7;
}

.ref-data__banner {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
}

.ref-data__banner--success {
  background: #f2f6f4;
  color: #355a52;
  border: 1px solid #dbe6e1;
}

.ref-data__banner--error {
  background: #fbf4ef;
  color: #8b5843;
  border: 1px solid #ecd8cd;
}

.ref-data__banner--panel {
  margin: 0 0 8px;
}

/* Shell: list + detail panel */

.ref-data__shell {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  gap: 16px;
}

.ref-data__shell--list-only {
  grid-template-columns: 1fr;
}

.ref-data__list,
.ref-data-panel {
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 24px;
  background: var(--surface, #fff);
  padding: 20px;
  display: grid;
  gap: 16px;
}

/* Toolbar */

.ref-data__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ref-data__search {
  flex: 1;
  min-width: 200px;
}

.ref-data__search input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 14px;
  font-size: 13px;
  background: var(--surface, #fff);
  color: var(--ink, #1a1a1a);
  outline: none;
}

.ref-data__search input:focus {
  border-color: #cfc5b6;
  box-shadow: 0 0 0 3px rgba(41, 68, 63, 0.08);
}

.ref-data__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.ref-data__toggle input[type="checkbox"] {
  margin: 0;
}

.ref-data__results-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--ink-muted, rgba(0, 0, 0, 0.5));
}

/* Loading skeleton */

.ref-data__loading {
  display: grid;
  gap: 10px;
}

.ref-data__loading-row {
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(90deg, #faf8f4 0%, #f1ede6 50%, #faf8f4 100%);
  background-size: 220% 100%;
  animation: refDataPulse 1.5s ease infinite;
}

@keyframes refDataPulse {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.ref-data__empty {
  text-align: center;
  padding: 40px 16px;
  color: var(--ink-muted, rgba(0, 0, 0, 0.5));
}

.ref-data__empty h4 {
  margin: 0 0 4px;
  font-size: 14px;
}

.ref-data__empty p {
  margin: 0;
  font-size: 13px;
}

/* Card rows */

.ref-data__rows {
  display: grid;
  gap: 10px;
}

.ref-data__row {
  width: 100%;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 18px;
  padding: 16px;
  background: var(--surface, #fff);
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  text-align: left;
  font: inherit;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.ref-data__row:hover,
.ref-data__row.is-selected {
  border-color: #cfc5b6;
  background: var(--surface-hover, #f5f5f5);
}

.ref-data__row.is-archived {
  opacity: 0.55;
}

.ref-data__row-main h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink, #1a1a1a);
}

.ref-data__row-side {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.ref-data__badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: #f2f6f4;
  color: #355a52;
}

.ref-data__badge--archived {
  background: #fff3e0;
  color: #e65100;
}

.ref-data__row-action {
  background: none;
  border: none;
  color: var(--ink, #1a1a1a);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}

.ref-data__row-action:hover {
  background: var(--surface-hover, #f5f5f5);
}

.ref-data__row-action--danger {
  color: #c62828;
}

.ref-data__row-action--danger:hover {
  background: #fbe9e7;
}

/* Pagination */

.ref-data__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.ref-data__pagination button {
  padding: 6px 14px;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 999px;
  background: var(--surface, #fff);
  color: var(--ink, #1a1a1a);
  font-size: 13px;
  cursor: pointer;
}

.ref-data__pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Detail panel */

.ref-data-panel {
  align-self: start;
  position: sticky;
  top: 20px;
  align-content: start;
}

.ref-data-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.ref-data-panel__eyebrow {
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-muted, rgba(0, 0, 0, 0.5));
}

.ref-data-panel__header h4 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--ink, #1a1a1a);
}

.ref-data-panel__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: var(--surface-hover, #f5f5f5);
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ink, #1a1a1a);
  opacity: 0.5;
  transition: opacity 0.15s, background 0.15s;
}

.ref-data-panel__close:hover {
  opacity: 1;
  background: var(--border, rgba(0, 0, 0, 0.08));
}

.ref-data-panel__content {
  display: grid;
  gap: 16px;
}

.ref-data-panel__field {
  display: grid;
  gap: 6px;
}

.ref-data-panel__field span {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-muted, rgba(0, 0, 0, 0.5));
}

.ref-data-panel__field input {
  padding: 12px 14px;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 14px;
  font-size: 14px;
  background: var(--surface, #fff);
  color: var(--ink, #1a1a1a);
  outline: none;
}

.ref-data-panel__field input:focus {
  border-color: #cfc5b6;
  box-shadow: 0 0 0 3px rgba(41, 68, 63, 0.08);
}

.ref-data-panel__toggle-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.ref-data-panel__toggle-field input[type="checkbox"] {
  margin: 0;
}

/* Divisions sub-section */

.ref-data-panel__divisions {
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.08));
  padding-top: 16px;
}

.ref-data-panel__divisions h5 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink, #1a1a1a);
}

.ref-data-panel__divisions-loading,
.ref-data-panel__divisions-empty {
  font-size: 12px;
  color: var(--ink-muted, rgba(0, 0, 0, 0.5));
  padding: 8px 0;
}

.ref-data-panel__division-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
}

.ref-data-panel__division-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.ref-data-panel__division-add {
  display: flex;
  gap: 8px;
}

.ref-data-panel__division-add input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
  border-radius: 14px;
  font-size: 13px;
  background: var(--surface, #fff);
  color: var(--ink, #1a1a1a);
  outline: none;
}

/* Footer */

.ref-data-panel__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.08));
  padding-top: 16px;
}

.ref-data-panel__footer-secondary {
  display: flex;
  gap: 8px;
}

/* Responsive */

@media (max-width: 1180px) {
  .ref-data__shell {
    grid-template-columns: 1fr;
  }

  .ref-data-panel {
    position: static;
  }
}

@media (max-width: 820px) {
  .ref-data {
    padding: 20px 14px 28px;
    gap: 16px;
  }

  .ref-data__header {
    flex-direction: column;
  }

  .ref-data__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .ref-data__search {
    min-width: unset;
  }

  .ref-data__row {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

---

### Task 6: Add dark mode to ref-data

**Files:**
- Modify: `web-app/src/app/components/admin-ref-data/admin-ref-data.component.css`

**Step 1: Add dark mode media query block**

Append before the responsive `@media (max-width: 1180px)` rule:

```css
@media (prefers-color-scheme: dark) {
  .ref-data__action--primary {
    background: #e8e8e8;
    color: #111111;
    border-color: transparent;
  }

  .ref-data__action--danger {
    color: #f5a8a8;
    border-color: #5c2020;
  }

  .ref-data__action--danger:hover {
    background: #2d1515;
  }

  .ref-data__banner--success {
    background: #1a2e25;
    color: #7fbfb5;
    border-color: #2a4a3e;
  }

  .ref-data__banner--error {
    background: #2d1e15;
    color: #d4a088;
    border-color: #5c3a2a;
  }

  .ref-data__loading-row {
    background: linear-gradient(90deg, #2a2a2a 0%, #333333 50%, #2a2a2a 100%);
    background-size: 220% 100%;
  }

  .ref-data__row:hover,
  .ref-data__row.is-selected {
    border-color: #555555;
  }

  .ref-data__badge {
    background: #1e2e2b;
    color: #7fbfb5;
  }

  .ref-data__badge--archived {
    background: #2d1e15;
    color: #c4977d;
  }

  .ref-data__row-action--danger {
    color: #f5a8a8;
  }

  .ref-data__row-action--danger:hover {
    background: #2d1515;
  }

  .ref-data__search input:focus,
  .ref-data-panel__field input:focus {
    border-color: #555555;
    box-shadow: 0 0 0 3px rgba(127, 191, 181, 0.12);
  }

  .ref-data__action:hover {
    border-color: #555555;
  }
}
```

---

### Task 7: Visual verification and commit

**Step 1: Build and verify**

Run: `cd web-app && npx ng serve` (or use running dev server)

Verify in browser:
1. Navigate to admin ref-data page — confirm card list with inline detail panel
2. Click a card — confirm detail panel opens on the right
3. Create new — confirm panel shows create form
4. Toggle dark mode in OS — confirm all 3 admin pages (dashboard, materials, ref-data) render in dark theme
5. Check archive/restore and divisions still work

**Step 2: Commit all changes**

```bash
git add web-app/src/app/components/admin-dashboard/admin-dashboard.component.css
git add web-app/src/app/components/admin-materials/admin-materials.component.css
git add web-app/src/app/components/admin-ref-data/
git commit -m "feat: ref-data list-detail layout and dark mode for all admin pages"
```
