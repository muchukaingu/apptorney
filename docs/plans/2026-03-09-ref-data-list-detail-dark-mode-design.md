# Reference Data List-Detail + Dark Mode Consistency

**Date:** 2026-03-09
**Status:** Approved

## Part 1: Reference Data List-Detail

Replace admin-ref-data's table + modal overlay with a card-based list + inline detail panel, matching the cases/legislations pattern.

### Current State
- `admin-ref-data` uses a `<table>` with rows for each record
- Edit/create uses a modal overlay (480px centered)
- Features: search, pagination, archive/restore, court divisions management

### Target State
- Card-based list (`.result-item` style cards) replacing table rows
- Inline detail panel (right sidebar, self-contained within component) replacing modal
- Retain all existing functionality: search, pagination, archive/restore, court divisions
- Panel shows record details + edit form when a card is selected

### Key Decisions
- Detail panel is self-contained within the ref-data component (not the app-level `.detail-sidebar`)
- Cards show: name, key metadata (type badge, status), and a visual indicator for archived items
- Search and pagination remain above the card list
- Create new record: opens detail panel with empty form

## Part 2: Dark Mode Consistency

Add `@media (prefers-color-scheme: dark)` blocks to each admin component that uses hardcoded light-only custom variables.

### Components to Fix
1. **`admin-dashboard.component.css`** — Remap `--dashboard-*` variables in dark mode
2. **`admin-materials.component.css`** — Remap `--materials-*` variables in dark mode
3. **`admin-ref-data.component.css`** — Fix hardcoded badge/banner semantic colors

### Approach
- Each component gets a `@media (prefers-color-scheme: dark)` block inside its scoped CSS
- Remap custom properties to dark-appropriate values (matching `styles.css` global dark palette)
- Fix any hardcoded hex colors for badges, banners, and status indicators
