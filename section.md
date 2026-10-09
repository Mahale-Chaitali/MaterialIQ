# Dashboard Sections: Purpose and How to Use Them

The Dashboard at `/` is a quick overview of sample material and procurement information. All displayed values, dates, statuses, and source timestamps are **demo data**. They are not live system information or official shortage calculations.

## 1. Page heading and controls

### Material Management Dashboard

The heading identifies the page. The **Demo data** badge and introductory text warn that the page is an illustrative prototype.

**Importance:** It sets expectations before users interpret any figures.

**How to use:** Treat the page as a way to explore the proposed workflow and interface, not as a source for operational decisions.

### Project selector

Changes which sample project's materials feed the summary cards, charts, and priority table. Options include all projects and individual demo projects.

**Importance:** Material needs and attention items are easier to review in a project context.

**How to use:** Choose a project to narrow the dashboard. Selecting “All projects” combines the sample records.

### Current data date

Displays the sample reference date used on the dashboard.

**Importance:** A reference date gives the example data a visible time context.

**How to use:** Read it as a fixed example date only. It does not show when a real source file was received or processed.

### Refresh button

Shows a message confirming that the demo display was refreshed.

**Importance:** Demonstrates where a refresh action belongs in the workflow.

**How to use:** Click it to see the demo confirmation. It does not reload files, contact SAP, or check any external system.

### Demo notice

The blue notice explains that all figures and source statuses are examples and that the page does not show live data or official shortage calculations.

**Importance:** Helps prevent example quantities and statuses from being mistaken for confirmed information.

## 2. Summary cards

These cards summarize material records for the selected project:

| Card | What it displays | How it helps |
| --- | --- | --- |
| **Total Materials** | Count of demo material records | Gives a quick sense of the size of the sample list |
| **Available Materials** | Records marked “Available” in the demo data | Highlights sample records with full availability status |
| **Partial Availability** | Records marked “Partial” | Draws attention to sample records with a mixture of available and required quantities |
| **Shortage Materials** | Records marked “Shortage” | Calls out sample records marked as having no available quantity |
| **Pending Procurement** | Records flagged as procurement pending | Gives a quick view of demo items with a pending procurement flag |

**How to use:** Select a project first, then use the cards as a compact orientation before reviewing the charts and individual table rows. These are counts of demo records, not verified stock or procurement positions.

## 3. Charts

Charts recalculate from the selected project's demo material records.

### Material status distribution

A ring chart shows the count of sample records in the **Available**, **Partial**, and **Shortage** statuses.

**Importance:** Makes the mix of demo status categories easy to compare at a glance.

**How to use:** Compare the category counts and use the priority table below to inspect particular records. A chart category is a sample label, not a validated business classification.

### Shortage quantity by material group

A bar chart groups positive sample shortage quantities by material group, such as Piping, Electrical, Mechanical, or Instrumentation.

**Importance:** Illustrates how a team might identify which material groups merit closer review.

**How to use:** Compare the displayed bars to decide which group to inspect in the attention table. Sample units may differ between material groups, so the bars should not be added or compared as if they shared one unit. These values do not come from an official shortage formula.

### Procurement status overview

A horizontal bar chart counts sample records by workflow stage: **Requested**, **In review**, **Ordered**, or **Not started**.

**Importance:** Gives a high-level example of how procurement workflow stages could be summarized.

**How to use:** Use it as a prompt to inspect the corresponding records and confirm their status in the authoritative procurement system. “Ordered” does not mean goods have been received or are physically available.

## 4. Priority materials

This section lists demo records needing attention: records that are not marked Available or have a pending-procurement flag.

### Search and status filter

- **Search** matches sample material code, description, material group, or project.
- **Status filter** narrows rows to All statuses, Available, Partial, or Shortage.

**Importance:** Helps users focus the list on a relevant material or status instead of scanning every row.

**How to use:** Select the project at the top of the page, then search by code/description or choose a status. The visible row count updates to show the filtered attention items.

### Table columns

| Column | Meaning in this demo |
| --- | --- |
| **Material Code** | Sample material identifier; it is clickable |
| **Description** | Sample description, with group and project shown below |
| **Required Qty** | Illustrative required quantity and unit |
| **Available Qty** | Illustrative available quantity and unit |
| **Shortage Qty** | Illustrative shortage quantity and unit |
| **Status** | Sample Available, Partial, or Shortage label |
| **Priority** | Sample High, Medium, or Low priority label |

**Importance:** The table connects overview indicators to records that can be reviewed individually.

**How to use:** Click a material code to open its detail view. On small screens, scroll the table horizontally if needed.

### Material detail view

The dialog shows the selected sample material's code, description, project, material group, required/available/shortage quantities, procurement-pending flag, status, and priority.

**Importance:** Provides more context for an individual item without leaving the Dashboard.

**How to use:** Open a row by clicking its material code. Close the dialog with its close button or by clicking outside it.

**Caution:** The detail view explicitly states that values are UI-preview examples, not live inventory, procurement, or shortage calculations.

## 5. Data freshness

The bottom panel lists example statuses and timestamps for six expected inputs: **ZPP7**, **MB52 HTML**, **PR**, **VA05**, **DCN**, and **Material Scope**. The examples use labels such as Ready, Review, and Pending.

**Importance:** Shows which source inputs a future connected system may need to track and where freshness/validation warnings could be surfaced.

**How to use:** In this prototype, use the panel only to understand the planned layout. Its caption says the timestamps are examples and that no files have been checked. For browser-local file selection and extension validation, use the File Management page; for local freshness warnings, use Data Freshness.

## Suggested review sequence

1. Read the demo notice.
2. Select a project.
3. Review the summary cards and charts for a high-level view of that project's sample data.
4. Search or filter the Priority materials table.
5. Open a material detail to inspect its example quantities and flags.
6. Treat the Data freshness panel as a layout demonstration, then use File Management or Data Freshness if exploring those browser-side demo interactions.

## Important limitations

- Dashboard values, labels, project assignments, and timestamps are examples.
- No source file is parsed or analyzed by the Dashboard.
- The page does not connect to SAP, a database, live inventory, or procurement services.
- No official shortage formula is implemented.
- PR/PO quantities are not automatically considered physical stock.
- DCN and VA05 behavior and official responsibility rules remain unconfirmed.
