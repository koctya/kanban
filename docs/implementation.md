## Implementation Plan: Kanban MVP

TL;DR: Build a one-board Kanban app using FastAPI, HTMX, and SQLite with a polished dark-first UI, Alpine.js-enhanced UX, and a Playwright validation flow after UI stabilization.

### 1. Scaffold the application
- Add `requirements.txt` with FastAPI, Uvicorn, Jinja2, HTMX, pytest, httpx, and Playwright.
- Add `.gitignore` for Python artifacts, SQLite files, and virtual environments.
- Create directories: `app/`, `templates/`, `templates/partials/`, `static/css/`, `static/js/`, `tests/`, and `docs/`.

### 2. Persistence & seed data
- Use SQLite for persistence with default `kanban.db`.
- Support overriding the database path with `KANBAN_DB_PATH` for isolated tests.
- Create `columns` and `cards` tables.
- Seed 5 fixed columns and example cards.
- Provide helper functions for reading board state, updating column titles, creating cards, deleting cards, and moving cards.

### 3. Backend routes
- `/` — render board page.
- `/columns/{column_id}/rename` — rename a column.
- `/cards/add` — add a new card.
- `/cards/{card_id}/delete` — delete a card.
- `/cards/{card_id}/move` — move a card to another column.
- Use HTMX request detection to return partial templates for dynamic updates.

### 4. Frontend templates
- `index.html` — main board shell, HTMX import, Alpine.js state, and modal UI.
- `partials/board_columns.html` — render each column.
- `partials/column_header.html` — column title edit form and count.
- `partials/cards.html` — card rendering with delete button and drag attributes.

### 5. Styling
- Dark-first theme with requested accent colors: yellow, blue, purple, navy, gray.
- Elegant card panels, smooth spacing, and horizontal scrolling for columns.
- Keep UI simple, polished, and responsive.

### 6. Drag-and-drop and Alpine integration
- Make cards `draggable="true"` and columns valid drop targets.
- Use plain drag events with a lightweight move request to the backend.
- Use Alpine.js to manage the add-card modal and to reattach handlers after board updates.
- Keep columns in one row with overflow scrolling instead of wrapping.

### 7. Testing
- Add `tests/test_app.py` for board rendering, creation, deletion, and move logic.
- Add `tests/e2e/test_drag_drop.py` with Playwright to verify the drag-and-drop experience.
- Use `KANBAN_DB_PATH` in test fixtures for clean database isolation.

### 8. Verification criteria
- Board loads with seeded dummy cards.
- Columns can be renamed.
- Cards can be added, deleted, and moved.
- Dark theme is default.
- Backend tests pass.
- Playwright flow verifies the card move experience.
