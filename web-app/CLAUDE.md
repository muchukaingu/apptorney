# Apptorney Web App

## Project Overview

Angular 19 web app for Zambian case law and legislation assistant. Includes a vanilla JS landing page (`index.html` + `app.js`) and an Angular SPA (`src/`).

## API Configuration

- API base: `/api` (defined in `src/app/services/api.service.ts` as `API_BASE`)
- Proxy target: `http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com`
- All API calls should use `API_BASE` from `api.service.ts` — never hardcode `/api/` paths

