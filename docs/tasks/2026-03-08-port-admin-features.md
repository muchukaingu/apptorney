# 2026-03-08 Port Legacy Admin Features

## Goal

Port the remaining admin functionality from the legacy AngularJS app (`web-app/angularjs-app`) to the new Angular 19 app (`web-app`). The new app already has a dashboard, case/legislation management, admin service, and role-based access — but is missing 8+ admin feature areas including reference data CRUD, system cleanup tools, analytics, and granular roles.

## Phase 1 — Reference Data CRUD Screens

- [x] **Court Management** — CRUD for courts and court divisions (legacy: `Courts.js`, `court-modal.html`, route `#/courts`)
- [x] **Jurisdiction Management** — CRUD for jurisdictions (legacy: route `#/jurisdictions`)
- [x] **Location Management** — CRUD for locations (legacy: route `#/locations`)
- [x] **Areas of Law Management** — CRUD for areas of law (legacy: route `#/areasOfLaw`)
- [x] **Legislation Types Management** — CRUD for legislation types (legacy: `Legislations.js`, route `#/legislationtypes`)
- [x] **Legislation Part Types Management** — CRUD for legislation part types (legacy: `LegislationPartTypes.js`, route `#/legislationparttypes`)
- [x] **Plaintiff Synonyms Management** — CRUD for plaintiff synonyms (legacy: `Synonyms.js`, route `#/plaintiffsynonyms`)
- [x] **Defendant Synonyms Management** — CRUD for defendant synonyms (legacy: `Synonyms.js`, route `#/defendantsynonyms`)

## Phase 2 — System Tools

- [ ] **Legislation Cleanup/Deduplication** — Identify and merge duplicate legislation entries (legacy: `Duplicates.js`, route `#/cleanup`)
- [ ] **Case Cleanup/Deduplication** — Identify and merge duplicate cases (legacy: route `#/cleanup-cases`)
- [ ] **Trash Management** — Soft-delete recovery for cases and legislations (legacy: `Trash-Cases.js`, routes `#/trash/cases`, `#/trash/legislations`)

## Phase 3 — Dashboard Enhancements

- [ ] **User Performance Metrics** — Per-user performance tracking (legacy: `Appuser.performance()`)
- [ ] **Case Completion Analytics** — Complete/incomplete/stub breakdown (legacy: `Dashboard.js`)

## Phase 4 — Access Control Enhancements

- [ ] **Granular Role System** — Port 4-tier userType system (types 1–4) replacing current binary admin/user check

## Reference

### What's Already Built (New App)
- Admin dashboard with stats (users, queries, revenue, subscriptions, growth)
- Case management (list, search, filter, create, edit)
- Legislation management (list, search, filter, create, edit)
- Admin service with 15+ API methods (`web-app/src/app/services/admin.service.ts`)
- View-based admin access control (admin/user roles)
- Admin routes in `backend/server/boot/admin-routes.js`

### Key Legacy Files
- `web-app/angularjs-app/app/scripts/controllers/` — Legacy controllers (Courts.js, Synonyms.js, Duplicates.js, Trash-Cases.js, Dashboard.js, Legislations.js, LegislationPartTypes.js)
- `web-app/angularjs-app/app/views/` — Legacy templates (court-modal.html, etc.)
- `web-app/angularjs-app/app/scripts/app.js` — Legacy route definitions

## Notes

- **2026-03-08 — Phase 1 complete.** All 8 reference data CRUD screens implemented via a single config-driven `AdminRefDataComponent`. Architecture: one generic Angular component + one `AdminRefDataService` + one backend factory function `registerRefDataRoutes()`. Includes paginated search, soft delete/restore, court divisions inline management, shimmer loading, modal create/edit, and admin sidebar sub-navigation.

  **Files created:**
  - `web-app/src/app/components/admin-ref-data/admin-ref-data.component.ts` — generic CRUD component
  - `web-app/src/app/components/admin-ref-data/admin-ref-data.component.html` — table + modal template
  - `web-app/src/app/components/admin-ref-data/admin-ref-data.component.css` — BEM-style scoped CSS
  - `web-app/src/app/models/admin-ref-data.models.ts` — types, configs, AdminSection
  - `web-app/src/app/services/admin-ref-data.service.ts` — generic CRUD + division service

  **Files modified:**
  - `backend/server/boot/admin-routes.js` — added `registerRefDataRoutes()` factory + 8 entity registrations + 3 division routes
  - `backend/common/models/{court,court-division,jurisdiction,location,area-of-law,legislation-type,part-type,plaintiff-synonyms,defendant-synonyms}.json` — added `deleted` property
  - `web-app/src/app/app.component.ts` / `.html` — admin sub-navigation, conditional rendering
  - `web-app/src/app/components/app-sidebar/app-sidebar.component.ts` / `.html` — 8 reference data nav buttons
  - `web-app/src/app/components/ui-components.module.ts` — re-exports AdminRefDataComponent
  - `web-app/src/app/models/ui.models.ts` — re-exports AdminSection type
  - `web-app/src/styles.css` — nav-btn--sub, nav-divider--label styles

  **Remaining:** Public LoopBack REST endpoints for reference models are still open (user requested locking them).
