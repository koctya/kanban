# Kanban Project

[Initial hypermedia kanban implementation](https://github.com/koctya/kanban/tree/kanban-htmx)

## Business Requirements

- An MVP of a Kanban style Project Management application as a web app  
- The web app should only have 1 board
- The board has fixed 5 columns that can be renamed  
- Each card has a title and details only
- Drag and drop interface to move cards between columns
- Add a new card to a column; delete an existing card, add card counts in column header
- No more functionality: no archive, no search/filter. Keep it simple.
- The priority is a slick, professional, gorgeous UI/UX with very simple features
- The app should open with dummy data populated for the single board

## Technical Details

- Implemented as a modern hypermedia app with FastAPI, HTMX, and Alpine.js frontend
- Use SQLite3 for persistence with default `kanban.db` and support `KANBAN_DB_PATH` for clean test isolation
- Server-rendered Jinja2 templates are the source of truth for board state
- Use HTMX to swap only affected page fragments for actions like rename, add, delete, and move
- Alpine.js manages lightweight client state: add-card modal, drag-and-drop handler initialization, and UI behavior
- No user management for the MVP
- Use popular libraries
- As simple as possible but with an elegant UI
- Ask questions about plan options

## Color Scheme

- Accent Yellow: `#ecad0a` - accent lines, highlights
- Blue Primary: `#209dd7` - links, key sections
- Purple Secondary: `#753991` - submit buttons, important actions
- Dark Navy: `#032147` - main headings
- Gray Text: `#888888` - supporting text, labels
- create both a light and dark theme with contrasting colors, with dark as default

## Design

- Use a hypermedia-first architecture: server-rendered templates plus HTMX for partial updates.
- Avoid a full SPA framework; keep JavaScript minimal and focused on small interactions.
- Alpine.js is used only for modal state and drag/drop handler lifecycle, not as the main UI framework.
- Actions map directly to backend routes and HTML partials, keeping the server as the source of truth.
- Horizontal columns stay in a single row with overflow scrolling rather than wrapping.
- This design is preferred for the MVP because it reduces frontend complexity, improves robustness, and keeps the app easier to maintain.

## Strategy

1. Write plan with success criteria for each phase to be checked off. Include project scaffolding, including .gitignore, and rigorous unit testing.
2. Execute the plan ensuring all criteria are met
3. Carry out extensive integration testing with Playwright or similar, fixing defects
4. Only complete when the MVP is finished and tested, with the server running and ready for the user

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. 
