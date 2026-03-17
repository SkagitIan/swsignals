# AGENTS.md

## Project scope
These instructions apply to the entire repository.

## Tech stack
- Hosting: GitHub Pages (static site)
- UI: HTML + vanilla JavaScript + Tailwind CSS (CDN)
- Animations: anime.js
- Charts: Chart.js
- Maps: Leaflet (if/when map features are added)

## Engineering principles
- Prefer simple code over complex code.
- Keep the app static-first and GitHub-Pages-friendly (no server assumptions).
- Favor readability: small functions, clear names, and minimal abstraction.

## Feature change documentation (required)
When a change adds, removes, or materially alters user-facing behavior, you **must** update `FEATURES.md` in the same commit.

A "feature change" includes, for example:
- New UI flows or controls
- Behavior changes users can notice
- New third-party integrations
- Changes to chart/map/animation behavior

A "feature change" does **not** include:
- Pure refactors with no user-visible behavior change
- Formatting-only edits
- Comments/doc wording fixes with no behavior impact

## Workflow checklist for every feature change
1. Make the code change.
2. Update `FEATURES.md`:
   - Add/update the relevant feature entry.
   - Record the date (`YYYY-MM-DD`).
   - Add a short note describing what changed and why.
3. Ensure code and feature docs ship together in one commit.

## Feature list format
- Keep entries concise and scannable.
- Use stable feature names; append dated updates beneath each feature.
- Most recent update first inside each feature section.
