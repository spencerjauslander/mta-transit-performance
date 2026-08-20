# On Time, Mostly — NYC Subway Performance (2020–2025)

An interactive dashboard exploring six years of New York City subway on-time performance, delays, and incident causes by line, category, month, and year.

**[View the data / add your live GitHub Pages link here]**

## What it does

- **Live board** — systemwide on-time performance, incidents, and delays in a countdown-clock-style display
- **Line selector** — click any subway line bullet (colored to match the real MTA line colors) to filter every chart and stat on the page to that line
- **Year-over-year trend** — on-time performance and delay rate, 2020–2025
- **Cause breakdown** — which reporting categories (crew availability, infrastructure, police/medical, etc.) drive the most delays
- **Seasonality** — how on-time performance shifts month to month
- **Line leaderboard** — all 19 lines ranked by on-time performance
- **Departure board heatmap** — on-time performance for every line, every year, colored on a red-to-green signal scale

## Stack

Plain HTML, CSS, and JavaScript — no build step. Charts are rendered with [Chart.js](https://www.chartjs.org/), vendored locally in `vendor/chart.umd.min.js` (no CDN dependency, so it works offline and isn't affected by ad blockers or restrictive networks). All data is precomputed from the source CSVs into `data.js` so the page works by simply opening `index.html`, or hosting the folder as-is on GitHub Pages.

## Data

Source files (not included in the deployed page, used only to generate `data.js`):
- `yearsummary.csv`, `monthsummary.csv`, `linesummary.csv`, `incident_type_summary.csv` — clean, pre-aggregated summaries used for all systemwide totals and charts.
- `Merged_df_master.csv` — raw line/month/category/incident records, used (after de-duplication) to derive the line-filtered category breakdown and the year-by-line heatmap. These two derived views are approximate due to duplication in the raw export, and can differ from the systemwide totals by roughly 1%.

## Running locally

Just open `index.html` in a browser — no server or build required.

## Deploying to GitHub Pages

1. Push this folder to your repository.
2. In repo settings, enable **GitHub Pages** for the branch/folder containing `index.html`.
3. Your dashboard will be live at `https://<username>.github.io/<repo>/`.
