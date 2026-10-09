# MaterialIQ

MaterialIQ is a responsive frontend prototype for material management, shortage analysis, procurement tracking, and ABB/vendor responsibility workflows. It is built with React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, and Lucide React. Shared UI components follow shadcn/ui conventions.

> **Prototype status:** This application currently uses demonstration data. It has no backend, database, SAP connection, file-content analysis, automatic email sending, or live notifications. Quantities, responsibilities, and dates are not authoritative business data.

## Requirements

- Node.js compatible with the installed Vite version
- npm

## Install and run

From the project root:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). Stop the development server with `Ctrl+C`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Dashboard |
| `/projects` | Projects placeholder |
| `/material-analysis` | Material Analysis |
| `/file-management` | File Management |
| `/procurement` | Procurement |
| `/vendors` | ABB & Vendor Management |
| `/reports` | Reports |
| `/settings` | Settings |
| `/data-freshness` | Data Freshness |

## What works

- **Dashboard:** Select a demo project, inspect sample summary cards and charts, filter/search priority rows, open material details, and refresh the demo display.
- **File Management:** Select or drag-and-drop the six expected input files. The browser checks filename extensions, displays file metadata, and supports replace/remove actions. Selected files are local to the current app session and are not uploaded.
- **Material Analysis:** Search and filter demo records, open a material detail panel, and export the displayed rows to CSV.
- **Procurement:** View demo PR, PO, and pending-requirement records with search, project/status/date filters, details, and missing/possibly overdue indicators.
- **ABB & Vendor Management:** Filter/select sample responsibility assignments, preview and export selections, prepare an unsent email draft, and print a report (the browser can save the print output as PDF).
- **Reports:** Filter and export demo material-status, shortage, procurement, and responsibility reports.
- **Settings and Data Freshness:** Configure display preferences and the demo freshness threshold; view missing files, extension errors, and metadata-based stale-file warnings.

## Demo-data and business-rule limitations

- File type checks validate the filename extension only; they do not validate file contents or analyze data.
- The default freshness threshold is 30 days and can be changed in Settings. It compares against the selected file's browser-reported last-modified time, which does not prove that the source data is current.
- Some display preferences are stored in browser local storage. Selected file objects are held in app-session state and are not persisted through a reload.
- Sample shortage values do not implement an official shortage formula. PR/PO quantities are not automatically treated as available physical stock.
- VA05 and DCN usage is unconfirmed. Sample dates and report filtering must not be treated as production rules.
- Responsibility assignments are provisional demo values and require confirmation from the official Material Scope file. No real vendor contacts are included.
- No automatic SAP/email monitoring, browser notification, or email sending is implemented. The global search and notification controls are disabled because they are not connected.

## Quality checks

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

`npm run test:watch` runs Vitest in watch mode. `npm run preview` serves the most recent production build locally.

At the last full verification, all 46 tests passed, lint and typecheck succeeded, and the production build succeeded. Vite reported that the minified JavaScript bundle exceeded its 500 kB warning threshold; see [prep.md](./prep.md) for the review results and project process.

## Project structure

```text
public/                 Static public assets
src/
  components/
    files/              Reusable local file upload UI
    ui/                 Shared interface primitives
  context/              App-session file state and preferences
  data/                 Demo records and navigation configuration
  layouts/              Application shell, header, and sidebar
  lib/                  Shared helpers and CSV exports
  pages/                Application routes/pages
  test/                 Test setup
  types/                Shared TypeScript types
```

For the end-to-end build history, page-by-page workflow, verified results, known limitations, and recommended next steps, read [prep.md](./prep.md).

For an explanation of each Dashboard section, its purpose, and how to use it, read [section.md](./section.md).
