# Design Notes: Hypermedia with HTMX + Alpine.js

This Kanban project is intentionally built with a server-rendered hypermedia approach, using FastAPI for backend logic and HTMX for partial updates. Alpine.js is added only where lightweight client-side state is needed.

## Why this design

- **Less complexity than a full SPA**
  - The app avoids a framework-heavy frontend like React, Vue, or Angular.
  - There is no large client-side bundling step or end-to-end state syncing layer.
  - Server-rendered templates remain the source of truth for board state.

- **Better developer productivity**
  - Routes map directly to backend handlers and HTML partials.
  - HTMX lets the UI update only the affected column or modal area.
  - Alpine.js adds simple client-side behavior without replacing the server-rendered page.

- **More robust UX with less JavaScript**
  - Card moves and form actions use HTMX-enabled requests, so HTML is refreshed from the backend.
  - The browser keeps native navigation semantics and accessible markup.
  - The app is easier to debug because the server output is visible in HTML.

## How the current app works

- The board is rendered on the server with Jinja2 templates.
- Each column and card is rendered as HTML from the current database state.
- Actions like renaming columns, adding cards, deleting cards, and moving cards are routed to FastAPI endpoints.
- HTMX is used to post these actions and swap only the required portion of the page:
  - column header updates use `hx-swap="outerHTML"`
  - card grid updates replace the card list node
  - board refreshes stay localized, not full-page reloads

## Role of Alpine.js

- Alpine manages the add-card modal state and input binding.
- It also initializes and reattaches drag-and-drop event handlers after dynamic partial updates.
- Alpine is intentionally minimal: it does not own the board data or render the cards.

## Why this is preferable for the MVP

- **Faster iteration**: fewer moving parts, easier to change backend logic and templates together.
- **Lower risk**: no large frontend framework means fewer compatibility and build issues.
- **Cleaner separation**: server handles data and rendering, client handles small interactions.
- **Good performance**: the app is fast because only the changed HTML is replaced, and JavaScript is only used where necessary.

## When a JS framework would be overkill

A framework like React would make more sense if the app required:

- a fully client-side routing experience,
- complex local state synchronization,
- offline support,
- rich drag/drop animations with client-side reconciliation,
- or many interactive views beyond a single board.

For this MVP, the hypermedia + HTMX + Alpine.js approach delivers a polished experience with far less complexity.
