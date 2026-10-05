# GymFlow

- `frontend/` — Angular (standalone components, signals, SCSS). Requires Node 24 (`nvm use`).
- `backend/` — Node.js + Express API (ES modules).

## UI theme is fixed

All frontend UI must follow `DESIGN_SYSTEM.md`. The classic ivory / navy / brass theme must not
be changed or mixed with another look. Use the tokens and shared classes in
`frontend/src/styles.scss` and the `app-icon` component. Never hard-code colors, fonts or radii
in component styles. Buttons, inputs, dropdowns, calendars, tables and modals must match the
specs in that file.
