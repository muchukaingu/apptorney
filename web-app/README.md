# Apptorney Web App (Angular)

This web app now uses Angular (standalone components) and mirrors the iOS flows:

- AI chat with threads (`/searches/ask-ai`, `/searches/chat-threads`)
- Cases search/details (`/cases/mobilesearch`, `/cases/viewCase`)
- Legislations search/details (`/legislations/mobilesearch`, `/legislations/viewLegislation`)
- Bookmarks/news/trends (`/Customers/bookmarks`, `/news/viewNews`, `/trendings/viewTrends`)
- Feedback (`/feedback`)

## Stack

- Angular 19
- TypeScript
- Angular HttpClient
- Angular Forms
- Angular dev-server proxy

## Run

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm start
```

3. Open the URL shown by Angular CLI (usually `http://localhost:4200`).

## API Handling

The app calls `/api/*` in the browser.

`proxy.conf.json` forwards `/api` to:

- `http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com`

This avoids browser CORS issues during development.
