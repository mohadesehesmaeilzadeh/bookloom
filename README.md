# Bookloom

Bookloom is a Persian, right-to-left personal library manager built with React and Vite. It runs entirely in the browser and stores data locally, so it does not require a backend server or user account for everyday use.

## Features

- Dashboard with real book counts, reading goals, reading statistics, and next-book recommendations
- Full book CRUD: add, edit, view details, and delete books
- React Router pages for dashboard, library, reading, wishlist, finished books, statistics, settings, and routed book details
- Centralized book statuses: wishlist, owned, reading, paused, finished, and abandoned
- Reading workflows: start, pause, resume, finish, and abandon books
- Reading progress tracking with current page, total pages, percentage, remaining pages, and last progress update
- Wishlist workflow with priority, estimated price, suggested store, and purchase conversion
- Search, filtering, sorting, and grid/list view modes
- Personal notes, reviews, ratings, and quotes
- Local next-book recommendation logic
- JSON backup, restore, merge, duplicate handling, and safe reset
- Application settings for theme, accent color, default start page, digit display, and delete confirmation
- Responsive RTL layout for Persian users

## Tech Stack

- React 19
- React DOM
- React Router
- Vite
- Oxlint
- Plain CSS with global CSS variables
- LocalStorage for persistence

## Requirements

You need Node.js and npm installed.

## Installation

```bash
npm install
npm run dev
```

After starting the development server, open the local URL printed by Vite. It is usually:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
```

Start the Vite development server.

```bash
npm run build
```

Build the production version into `dist`.

```bash
npm run preview
```

Preview the production build locally.

```bash
npm run lint
```

Run Oxlint.

## App Routes

| Route | Page |
| --- | --- |
| `/` | Dashboard |
| `/library` | My Library |
| `/reading` | Currently Reading |
| `/wishlist` | Wishlist |
| `/finished` | Finished Books |
| `/statistics` | Reading Statistics |
| `/settings` | Settings |
| `/books/:bookId` | Book Details |

## Project Structure

```text
src/
  components/   Reusable UI components
  constants/    Routes, statuses, priorities, settings, and shared constants
  context/      BooksContext, PreferencesContext, and ToastContext
  hooks/        Book, goal, recommendation, and collection-control hooks
  layouts/      Main application layout
  pages/        Routed application pages
  styles/       Global styles
  utils/        Validation, persistence, backup, sorting, filtering, and formatting utilities
```

## Data Persistence

Bookloom stores data in the browser's LocalStorage. The main Bookloom-owned keys are:

- `bookloom_books`
- `bookloom_reading_goals`
- `bookloom_preferences`
- `bookloom_collection_preferences` for compatibility with older stored view-mode preferences

Use the Settings page to export a JSON backup before clearing browser data or moving to another device.

## Backup and Restore

Bookloom backups include books, reading goals, and application preferences.

Restore supports two modes:

- Replace: replace current Bookloom data with the selected backup.
- Merge: combine the backup with current data and keep the newest duplicate book record based on `updatedAt`.

The full data reset flow requires typed confirmation and removes only Bookloom-owned storage keys.

## Settings and Personalization

The Settings page supports:

- Light, dark, and system themes
- Accent color selection
- Default start page
- Persian or Latin digit display
- Delete-confirmation preference
- Resetting preferences without deleting books

## Development Notes

- Book statuses and priorities are centralized in `src/constants`.
- Data validation and normalization live in `src/utils`.
- Pages do not access LocalStorage directly; persistence goes through storage utilities and React context.
- Older Phase 10 backup files are normalized and migrated where possible.

## Current Limitations

Bookloom is a local-first browser app. It does not currently include cloud sync, authentication, external book APIs, Electron packaging, desktop file access, or reading timers.

## License

No license has been specified yet.
