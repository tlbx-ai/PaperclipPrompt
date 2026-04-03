# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vite-powered Three.js game prototype. Keep gameplay code in `src/`, with `src/main.js` as the current entry point for scene setup, rendering, and idle-loop state. Put presentation rules in `src/style.css`. Use `src/asset-registry.js` to track art, audio, model, and procedural asset placeholders during development. The root `index.html` only bootstraps the app. Reserve `public/assets/` for static textures, models, audio, and thumbnails if they are added later. Treat `.midterm/` as generated local tooling, not project source.

## Build, Test, and Development Commands
- `npm install` installs Vite and Three.js dependencies.
- `npm run dev` starts the local dev server with fast reload at `http://localhost:5173/`.
- `npm run build` creates a production bundle in `dist/`.
- `npm run preview` serves the built output for a final smoke check.

For MidTerm browser work, open the preview against the Vite server rather than static files.

## Coding Style & Naming Conventions
Use ES modules and keep logic explicit. Prefer `const` by default, short pure helper functions for gameplay math, and descriptive names such as `buyClipper`, `refreshPhase`, or `spawnClip`. Use 2-space indentation in JavaScript and keep CSS selectors flat and readable. New files should use lowercase names; use hyphens for assets and standard web naming for source files.

## Testing Guidelines
Automated tests are not configured yet. Until a test runner exists, verify changes with:
- `npm run build` to catch bundling errors
- `npm run dev` plus the MidTerm preview for interaction checks

If you add non-trivial gameplay systems, introduce a `tests/` directory and cover deterministic logic such as economy balancing or upgrade thresholds.

## Commit & Pull Request Guidelines
Follow short, imperative commit messages, for example `Add drone harvesting loop` or `Refine HUD layout`. Keep commits focused. Pull requests should include a concise summary, manual verification steps, and screenshots or short recordings for visible gameplay or UI changes.

## Agent-Specific Notes
Do not manually edit `.midterm/`. Use it to drive the live preview, inspect the rendered page, and validate browser-side behavior while iterating on the game.

At the start of every new session, read `gamedesign.md` into context before making product, gameplay, UX, or visual decisions.

Whenever the user provides prompts that define game design, game purpose, UX direction, tone, progression, or presentation constraints, record the durable parts of that guidance in `gamedesign.md`. Treat `gamedesign.md` as the persistent source of truth for the evolving design brief.

When adding or changing assets, update `src/asset-registry.js` so the development asset browser stays useful. Keep asset-browser controls development-only unless the user explicitly asks to expose them in player mode.
