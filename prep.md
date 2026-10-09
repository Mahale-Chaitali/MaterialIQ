# MaterialIQ Project Preparation and Build Process

## 1. Purpose and current state

MaterialIQ is a frontend prototype for a Material Management & Shortage Analysis System. It provides the navigation, page layouts, sample workflows, demo records, and browser-side interactions needed to review the intended user experience.

This is not a connected operational system. There is no backend API, database, SAP integration, file ingestion/analysis, automatic email sending, or browser notification service. Demo values and provisional responsibility assignments must not be treated as real business data.

## 2. Technology foundation

- React and TypeScript
- Vite development server and production bundler
- Tailwind CSS
- React Router
- Reusable UI primitives following shadcn/ui conventions
- Lucide React icons
- Recharts
- Vitest, jsdom, React Testing Library, and jest-dom
- oxlint

### Main folders

```text
public/
src/
  assets/
  components/
    files/
    ui/
  context/
  data/
  layouts/
  lib/
  pages/
  test/
  types/
```

- `components/ui`: shared buttons, badges, cards, inputs, and tables.
- `components/files`: reusable browser-local file selection card.
- `context`: file state for the current app session and display/freshness preferences.
- `data`: demo datasets, file requirements, and sidebar route metadata.
- `layouts`: responsive application shell, header, and sidebar.
- `lib`: formatting and CSV helpers.
- `pages`: route page implementations.
- `test`: test environment setup.
- `types`: shared TypeScript definitions.

## 3. Product build sequence

The application was built incrementally on the existing project foundation, preserving working code rather than recreating pages between prompts.

### Step 1 — Foundation and testing

- Set up the React + TypeScript + Vite application.
- Added the responsive application shell, sidebar, top header, route structure, and reusable interface primitives.
- Established Vitest and React Testing Library.
- Added tests for app rendering, sidebar links, route/page rendering, and compact-screen navigation.

### Step 2 — Dashboard

- Added a project selector, sample data date, demo refresh feedback, summary cards, and Recharts visualizations.
- Added priority-material table search/status filtering and material detail view.
- Kept all figures explicitly identified as demonstration values.

### Step 3 — File Management

- Added reusable input cards for ZPP7 NEW, MB52 HTML, PR, VA05, DCN, and Material Scope.
- Added browser file selection, drag-and-drop, replace/remove, filename/size/modified-date display, supported-extension checks, and summary counts.
- File selection remains in browser/app state only; no file is transmitted, parsed, or analyzed.

### Step 4 — Material Analysis

- Added a searchable/filterable demo material register with project, material group, status, responsibility, and shortage-only filters.
- Added material details and CSV export of the currently displayed records.
- Kept shortage values illustrative; no official formula is asserted.

### Step 5 — Procurement

- Added PR, PO, and pending-requirement views, search, project/status/date filters, and record details.
- Missing dates and quantities remain visibly unknown instead of being inferred.
- Potentially overdue highlighting is based on sample values and a fixed demo reference date.

### Step 6 — ABB & Vendor Management

- Added provisional ABB/vendor demo responsibility lists, project/material filters, selection checkboxes, selected-material preview, and CSV export.
- Added a non-sending email draft and browser print workflow for saving a report as PDF.
- Vendor contacts are not fabricated; scope responsibilities require confirmation from the official Scope file.

### Step 7 — Reports, Settings, and Data Freshness

- Added material status, shortage, procurement, and responsibility report views with demo filters and CSV export.
- Added display preferences and configurable demo freshness threshold.
- Added missing-file, metadata-based stale-file, and extension-validation warnings.
- Added clear notice that processing time, SAP monitoring, email monitoring, and automatic file updates are unavailable.

### Step 8 — Frontend review and documentation

- Smoke-tested all nine routes and principal browser interactions.
- Checked compact-screen navigation and horizontal document overflow at a 390px viewport.
- Clarified misleading/static elements: the dashboard description says demo, storage is labeled as a sample estimate, backend status is not claimed, global search and notifications are disabled, and the account is identified as a demo user.
- Clarified that a procurement report date fallback is demo-filter behavior, not a confirmed VA05/business rule.
- Updated the README route list and added this process record.

## 4. Routes and page scope

| Path | Page | Current scope |
| --- | --- | --- |
| `/` | Dashboard | Interactive demo summary, charts, priority rows, and details |
| `/projects` | Projects | Placeholder; no project CRUD or backend |
| `/material-analysis` | Material Analysis | Search/filter/detail/export of demo material rows |
| `/file-management` | File Management | Browser-local file selection and extension checks |
| `/procurement` | Procurement | Demo PR/PO/pending views and filters |
| `/vendors` | ABB & Vendor Management | Demo scope lists, selection, preview, export, draft, print |
| `/reports` | Reports | Demo report types, filters, and CSV exports |
| `/settings` | Settings | Display options and demo freshness threshold |
| `/data-freshness` | Data Freshness | Local file state, missing/stale/validation warnings |

## 5. Input-file expectations and limitations

Expected inputs and current extension checks:

| Input | Expected format | Current frontend behavior |
| --- | --- | --- |
| ZPP7 NEW | `.xls`, `.xlsx` | Selects file and checks extension only |
| MB52 | `.html`, `.htm` | Selects file and checks extension only |
| PR | `.xls`, `.xlsx` | Selects file and checks extension only |
| VA05 | `.xls`, `.xlsx` | Selects file and checks extension only |
| DCN | `.xls`, `.xlsx` | Selects file and checks extension only; business use unconfirmed |
| Material Scope | `.xls`, `.xlsx` | Selects file and checks extension only |

An accepted extension does not mean that the workbook/HTML contents are valid. The browser does not upload or process the selected input. The default freshness check compares the browser-reported file modification timestamp to a 30-day threshold; this is not proof of current source data. The threshold is configurable in Settings.

Selected files are shared across in-app routes during the current session but are not persisted through reload. Display preferences are stored in local storage.

## 6. Demo/business-rule safeguards

- Dashboard and table quantities, statuses, dates, and source freshness examples are demo content.
- No official shortage formula is implemented.
- PR and PO quantities are not treated as stock physically available for use.
- VA05 and DCN meanings/processing are not confirmed.
- The procurement report's expected-delivery/requirement-date fallback exists only as demo report filtering behavior.
- ABB/vendor assignment examples are provisional, and the final rules must come from the official Material Scope file and stakeholder confirmation.
- No vendor names or email addresses are invented.
- Email composition does not send email.
- Print invokes the browser's own print workflow; PDF creation is completed by the user in the browser.
- No incoming email or SAP monitoring, automatic file refresh, or browser notifications are present.

## 7. Install, run, and verify

Use a Node.js release supported by the installed Vite version, then run from the repository root:

```sh
npm install
npm run dev
```

Use the local URL printed by Vite, normally `http://localhost:5173`. Press `Ctrl+C` to stop the development server.

Available checks and helpers:

```sh
npm test           # Run the Vitest suite once
npm run test:watch # Run Vitest in watch mode
npm run lint       # Run oxlint on src
npm run typecheck  # Run TypeScript project checks
npm run build      # Type-check and create the production bundle
npm run preview    # Preview the most recent production build
```

## 8. Last verified results

The final full check after the review UI edits reported:

- `npm test`: 1 test file passed; **46 tests passed, 0 failed**.
- `npm run lint`: **passed**.
- `npm run typecheck`: **passed**.
- `npm run build`: **succeeded**.
- Browser route pass: **9 routes opened**, with **0 console errors, 0 page errors, and 0 failed requests**.
- Browser interactions verified: dashboard project selection; invalid file extension rejection; material search and detail; procurement PO tab; ABB selected-material CSV export; and print invocation.
- Mobile-width pass at 390px: **no horizontal document overflow on all 9 routes**; compact navigation opened.

### Known build warning

Vite reports the minified JavaScript bundle at approximately **806.99 kB**, above its 500 kB warning threshold. This does not fail the production build, but code-splitting/lazy loading should be considered before production deployment.

### Review boundaries

The browser checks verified the development server and representative interactions; they do not prove real-file parsing, backend behavior, email delivery, SAP integration, accessibility conformance, or production deployment. The workspace has no Git repository, so the created/modified file inventory could not be checked using a Git diff. Three starter assets (`src/assets/hero.png`, `react.svg`, and `vite.svg`) were found to have no references in `src`; they were left in place.

## 9. Recommended next steps

1. Confirm the input workbook/HTML schemas and ownership of each source.
2. Have the business owner/mentor confirm the shortage formula and treatment of stock, PR, PO, receipts, reservations, and dates.
3. Confirm how VA05 and DCN should affect the workflow.
4. Confirm the official Material Scope responsibility rules and how vendor/contact records will be maintained.
5. Define API contracts and a normalized data model with source-file provenance, validation results, processing status, timestamps, and audit history.
6. Implement authenticated backend upload/processing and database persistence; connect UI pages only after the API and business rules are approved.
7. Add integration tests with representative, anonymized input files and validate the output with business stakeholders.
8. Reduce the production bundle size and perform deployment, security, and accessibility reviews before using real operational data.
