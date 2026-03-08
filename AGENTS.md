# Apptorney Monorepo

## Structure

- `backend/` - LoopBack 3 Node.js API (see backend/AGENTS.md)
- `web-app/` - Angular frontend (see web-app/AGENTS.md)
- `android-app/` - Kotlin Android app
- `ios-app/` - Swift iOS app

## Conventions

- Each project is self-contained with its own build/test tooling
- Shared documentation lives in `docs/`

## Task Tracking

- Track cross-session work in `docs/tasks/`
- Start with `docs/tasks/README.md` and `docs/tasks/index.md`
- When a task is completed, update the relevant Markdown checkbox from `[ ]` to `[x]`
- Add a short completion note in the task file's `## Notes` section with the date and changed files
