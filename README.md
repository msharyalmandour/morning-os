# Morning OS

A calm daily wellness PWA — bilingual Arabic (RTL) / English (LTR) with instant switching.

Design language: a bold, colorful Bento-grid dashboard — a warm cream base with
saturated flat card colors (mustard, sage, blush, lavender, coral), heavy Manrope/
Tajawal display type, pill buttons, and a floating dark bottom nav. The home screen's
hero card still shifts color with the time of day (mustard mornings, sage afternoons,
coral evenings, lavender nights).

## Features

- **Morning Ritual** — a short guided flow each day: three slow breaths, an "inner
  weather" mood + energy check-in, an intention, and a gratitude note.
- **Life Score** — a 0–100 score built from today's ritual, hydration, journaling,
  streak, and rolling mood, with a breakdown and 7/14-day history charts.
- **Brain Dump Journal** — a free-write space with mood tagging, search, and a
  running entry history.
- **AI Memory** — an on-device, rule-based reflection companion. It notices
  patterns (streaks, recurring journal keywords, mood trends) and chats using
  local templates — nothing is sent to a server.
- **Performance** — four standalone daily programs (Sleep, Nutrition, Movement,
  Nervous System), each its own screen. Every day surfaces one lesson from a
  9-step curriculum that deepens tier by tier (foundational → building →
  advanced) as the domain's "Day N" count grows — action, the physiological
  "why," the realistic upside of keeping it up, and the realistic cost of
  skipping it. Progress is tracked with a 7-day dot history and a per-domain
  streak, and completing each domain feeds into the Life Score.

All data (ritual history, journal entries, chat log, performance history,
settings) is stored only in the browser's `localStorage`. There is no backend,
no accounts, and no network calls other than loading the Google Fonts
stylesheet.

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
css/style.css            design system (colors, hero animation, cards, RTL rules)
js/i18n.js                Arabic/English dictionary + t() helper
js/lessons.js             Performance curriculum content (4 domains x 9 lessons, EN/AR)
js/app.js                 state, ritual flow, life score, journal, AI memory, performance, nav
manifest.webmanifest      PWA manifest
sw.js                     offline service worker
icons/                    app icons (svg + png, incl. maskable + apple-touch)
```
