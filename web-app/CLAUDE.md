# Apptorney Web App

## Project Overview

Angular 19 web app for Zambian case law and legislation assistant. Includes a vanilla JS landing page (`index.html` + `app.js`) and an Angular SPA (`src/`).

## API Configuration

- API base: `/api` (defined in `src/app/services/api.service.ts` as `API_BASE`)
- Proxy target: `http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com`
- All API calls should use `API_BASE` from `api.service.ts` — never hardcode `/api/` paths

## Task Tracking

- Cross-session task files live at `../docs/tasks/`
- Start with `../docs/tasks/README.md` and `../docs/tasks/index.md`
- When web-app work is completed, update the relevant Markdown checkbox from `[ ]` to `[x]`
- Add a short completion note in the task file's `## Notes` section with the date and changed files
