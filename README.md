# بحثي (Bahthi)

A research-project management dashboard for university nursing students — fully
Arabic, RTL, built as a static PWA. It's a real research workspace, not a
textbook: a Bento-grid dashboard that always answers "where is my research at,
what have I finished, what should I work on now, and what's next."

Design language: the same bold Bento-grid dashboard system as the rest of the
app — a warm cream base with saturated flat card colors (mustard, sage, blush,
lavender, coral), heavy Tajawal display type, pill buttons, and a floating
dark bottom nav.

## Features

- **Research journey** — an 8-stage stepper (Proposal → Literature Review →
  Research Gap → Aim & Research Questions → Methodology → Data Collection →
  Data Analysis → Final Research), derived live from what's actually been
  completed rather than a number you set by hand.
- **Home dashboard** — research progress %, current stage, current task, next
  step, and the next upcoming deadline, all computed from real state.
- **Proposal** — the 7 core proposal sections (Background, Literature Review,
  Statement of Problem, Gap of Knowledge, Aim, Research Questions,
  Methodology) each with a status (done / in progress / not started) and
  notes; a dedicated Research Gap card (what we know → what we don't → the
  gap → your study) with a warning if the gap isn't yet linked to an aim; an
  Aim & Research Questions card; and a structured Methodology card (design,
  setting, population, sampling, data collection method, study tool).
- **Literature (evidence library)** — studies organized by research theme,
  filterable by which proposal section they support, each with title, year,
  authors, key finding, relevance to your study, and reference. Collected /
  reviewed / remaining counts stay in sync automatically.
- **Tasks** — an actionable to-do list with priority, deadline, and status,
  driving the "current task" and "next deadline" shown on the dashboard.

All data (proposal sections, gap/aim/methodology text, studies, tasks,
settings) is stored only in the browser's `localStorage`. There is no
backend, no accounts, and no network calls other than loading the Google
Fonts stylesheet.

## Running locally

This is a static site — no build step. Serve the folder with any static file
server, e.g.:

```
npx http-server -p 8080
```

Then open `http://localhost:8080`.

## PWA

The app ships a `manifest.webmanifest` and a service worker (`sw.js`) that
caches the app shell for offline use. Installable on desktop and mobile
(Add to Home Screen).

## Structure

```
index.html              markup + all screens
css/style.css            design system (Bento colors, cards, stepper, RTL rules)
js/data.js               research journey, proposal sections, themes, seed data
js/app.js                 state, progress calc, screen renders, CRUD, nav
manifest.webmanifest      PWA manifest
sw.js                     offline service worker
icons/                    app icons (svg + png, incl. maskable + apple-touch)
```
