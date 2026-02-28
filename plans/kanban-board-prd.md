# Kanban Board PRD

## Problem Statement

I need a simple, personal task management tool built into my existing application. I want to organise my work visually using a kanban-style board with columns and cards, without relying on third-party tools like Trello or Notion. The solution should feel minimal, fast, and native to my app -- not a feature-heavy clone of an existing product.

## Solution

A lightweight kanban board feature integrated into the existing Ralph app. Users can create multiple boards, each with customisable columns and draggable cards. The board leverages Convex for real-time data persistence and uses shadcn/ui components for a consistent, minimal UI.

The feature is accessed via a "Boards" entry in the sidebar. A board list page shows all boards; clicking a board navigates to the board view with breadcrumb navigation (Home > Boards > Board Name). Cards have a title and optional description, editable via a modal dialog.

## User Stories

1. As a user, I want to see a "Boards" link in the sidebar, so that I can quickly access my kanban boards.
2. As a user, I want to see a list of all my boards on the boards page, so that I can choose which board to work on.
3. As a user, I want to create a new board by entering a title, so that I can start organising a new set of tasks.
4. As a user, I want a newly created board to open immediately after creation, so that I can start working right away.
5. As a user, I want a new board to come with default columns (To Do, In Progress, Done), so that I have a useful starting structure without setup.
6. As a user, I want to see breadcrumbs (Home > Boards > Board Name) when viewing a board, so that I can navigate back easily.
7. As a user, I want to see all columns displayed side-by-side on the board, so that I can visualise my workflow.
8. As a user, I want to add a new column to a board by clicking an "Add Column" button after the last column and entering a title, so that I can customise my workflow.
9. As a user, I want to rename a column by clicking on its header, so that I can adjust my workflow labels.
10. As a user, I want to reorder columns using left/right arrow buttons, so that I can arrange my workflow stages.
11. As a user, I want to delete a column, so that I can remove workflow stages I no longer need.
12. As a user, I want to see a confirmation dialog when deleting a column that contains cards, warning me that the cards will also be deleted, so that I don't accidentally lose work.
13. As a user, I want to add a card to a column by clicking a "+" button, entering a title in a modal, and confirming, so that I can capture a new task.
14. As a user, I want to click on a card to open a detail modal showing its title and description, so that I can see and edit its details.
15. As a user, I want to edit a card's title and description in the detail modal, so that I can refine my task details.
16. As a user, I want to delete a card from the detail modal with an "Are you sure?" confirmation, so that I can remove tasks I no longer need.
17. As a user, I want to drag and drop cards within a column to reorder them, so that I can prioritise my tasks.
18. As a user, I want to drag and drop cards between columns, so that I can move tasks through my workflow.
19. As a user, I want my boards, columns, and cards to persist across sessions, so that I don't lose my work.
20. As a user, I want my boards to be tied to my authenticated identity, so that only I can see my boards.

## Implementation Decisions

### Architecture: Presentational / Container Separation

The kanban board UI is built as a tree of "dumb" presentational components that receive data and callbacks as props, with no knowledge of Convex. The route/page component acts as the container layer, wiring Convex queries and mutations to the presentational component props.

This follows the same pattern as the existing shadcn/ui components (e.g. `Card`, `Tooltip`) -- the kanban components compose shadcn primitives and add kanban-specific layout and behaviour.

**Presentational layer** (`src/components/ui/kanban/`):

- `KanbanBoard` -- renders columns horizontally, "Add Column" button at the end
- `KanbanColumn` -- renders a column using shadcn `Card`, with header (click-to-rename, reorder arrows, delete), card list, and "+" button
- `KanbanCard` -- renders a card using shadcn `Card`, clickable to open details

These components accept a props interface with data arrays and callback functions. They do not import from `convex/`.

**Container layer** (route components):

- The route file imports Convex hooks (`useQuery`, `useMutation` from `convex/react`) and maps the Convex API to the kanban component props. This layer is thin glue with no business logic.

### Data Model (Convex Schema)

Three new tables added to `convex/schema.ts`:

- **`boards`**: `title` (string), `userId` (string -- WorkOS user ID). Indexed by `userId`.
- **`columns`**: `title` (string), `boardId` (id ref to boards), `position` (number). Indexed by `boardId`.
- **`cards`**: `title` (string), `description` (optional string), `columnId` (id ref to columns), `position` (number). Indexed by `columnId`.

### Ordering Strategy

Integer positions (1, 2, 3...) for both columns and cards. When an item is moved, affected items in the target list have their positions recalculated. This is simple and adequate for a single-user board. Can be migrated to fractional indexing later if needed.

### Convex Functions

Three new function files:

- **`convex/boards.ts`**: `list` (query, filtered by userId), `create` (mutation, creates board + three default columns), `get` (query, single board by ID)
- **`convex/columns.ts`**: `list` (query, by boardId, ordered by position), `create` (mutation), `rename` (mutation), `delete` (mutation, cascades to delete all cards in the column), `reorder` (mutation, swaps positions of two columns)
- **`convex/cards.ts`**: `list` (query, by boardId, ordered by position), `create` (mutation, appends to end of column), `update` (mutation, title + description), `delete` (mutation), `move` (mutation, changes columnId and/or position, recalculates positions in source and target columns)

### Routing

- `/boards` -- board list page
- `/boards/$boardId` -- individual board view

### Sidebar Integration

A "Boards" entry added to the sidebar navigation, placed under the Home section with an appropriate icon.

### Drag and Drop

Uses `@dnd-kit/core` and `@dnd-kit/sortable` for card drag-and-drop within and across columns. Column reordering uses simple left/right arrow buttons (not drag-and-drop).

### UI Components Used

The kanban board composes existing shadcn/ui components:

- `Card`, `CardHeader`, `CardTitle`, `CardContent` for columns and cards
- `Button` for actions (add, delete, reorder arrows)
- `Dialog` / `AlertDialog` for card detail modal and delete confirmations
- `Input` / `Textarea` for title and description editing
- `Breadcrumb` for navigation

### Authentication

Board ownership is determined by the WorkOS user ID. The `boards.list` query filters by the authenticated user's ID. No multi-user sharing or collaboration.

## Implementation Phases

### Phase 1: Boards (tracer bullet -- proves full stack connectivity)

- Convex schema + board create/list/get functions
- Board list page with "Create Board" dialog
- Route at `/boards` and `/boards/$boardId` (board view can be a placeholder)
- Sidebar "Boards" entry
- Breadcrumb navigation
- **Convex tests**: board creation (with default columns), board listing by user

### Phase 2: Columns

- Column create/rename/delete/reorder Convex functions
- Board view page rendering columns
- Add column button, click-to-rename, left/right reorder arrows, delete with confirmation dialog
- **Convex tests**: column CRUD, cascade delete, reorder logic

### Phase 3: Cards

- Card create/update/delete Convex functions
- Cards rendered inside columns
- "+" button to add card (opens modal with title input)
- Card detail modal for viewing/editing title + description
- Card deletion with "Are you sure?" confirmation
- **Convex tests**: card CRUD, position management

### Phase 4: Drag and Drop

- `@dnd-kit` integration for card drag-and-drop
- Card move Convex mutation (change column and/or reorder)
- Visual drag feedback
- **Convex tests**: card move across columns, reorder within column

Each phase delivers a working, deployable increment.

## Testing Decisions

### Philosophy

Tests verify behaviour through public interfaces (Convex queries and mutations), not implementation details. A mutation is executed, then a query is used to assert on the result. No direct database assertions.

This follows the TDD red-green-refactor loop: write one failing test, implement just enough to pass, repeat. Vertical slices, not horizontal.

### What to Test

The Convex functions layer is the deep module -- small interface (queries + mutations), complex logic inside (ordering, cascading deletes, position recalculation). This is where automated tests provide the most value.

Behaviours to test:

1. Board creation produces three default columns (To Do, In Progress, Done) with correct ordering
2. Board listing returns only boards for the authenticated user
3. Column creation places the new column after existing columns
4. Column renaming persists the new title
5. Column deletion also deletes all cards in that column
6. Column reordering swaps positions correctly
7. Card creation places the card at the end of the column
8. Card update persists title and description changes
9. Card deletion removes the card and remaining cards maintain order
10. Card move updates column reference and positions in both source and target columns

### What Not to Test

- React components / UI rendering (thin presentational layer, likely to change during iteration)
- Route/container wiring (thin glue with no logic)
- End-to-end browser tests (manual verification of each tracer bullet phase is sufficient for a personal project)

### Test Infrastructure

- **Library**: `convex-test` for running Convex functions against an in-memory backend
- **Pattern**: mutation + query pairs (write via mutation, assert via query)
- **Location**: test files alongside Convex function files

### Prior Art

- **`convex/todos.ts`** -- demonstrates the Convex query/mutation pattern that the kanban functions will follow. Tests will verify through the same public interface rather than internal state.
- **`src/routes/demo/convex.tsx`** -- demonstrates the container pattern for wiring Convex hooks (`useQuery`, `useMutation` from `convex/react`) to shadcn UI components in a route file. This is the same pattern the kanban board route will follow: Convex data in, props to presentational components out.

## Out of Scope

- Board deletion
- Board icons, colours, or metadata beyond title
- Card labels, due dates, priorities, or attachments
- Card comments
- User assignment or multi-user collaboration
- Search or filtering
- Inline editing of cards on the board
- Drag-and-drop for column reordering (using arrow buttons instead)
- Column drag-and-drop reordering
- Archiving cards or columns
- Board templates beyond the default three columns
- Mobile-specific responsive layout
- Keyboard shortcuts
- Undo/redo

## Further Notes

- The integer position ordering strategy is a deliberate simplicity choice. If the app scales beyond personal use or card counts grow significantly, migrating to fractional indexing would eliminate the need to rewrite positions on every move.
- The presentational/container separation means the kanban UI components could theoretically be extracted into a standalone component library or reused with a different backend.
- Each implementation phase is designed as a tracer bullet -- a thin, end-to-end slice that can be manually verified in the browser before moving to the next phase.
