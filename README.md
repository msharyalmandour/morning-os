# Morning OS

A calm daily wellness PWA — bilingual Arabic (RTL) / English (LTR) with instant switching.

Design language: olive green, warm cream, and morning gold, inspired by Apple, Calm,
Headspace, and WHOOP — glassmorphism cards over an animated sunrise/day/night hero.

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

All data (ritual history, journal entries, chat log, settings) is stored only in
the browser's `localStorage`. There is no backend, no accounts, and no network
calls other than loading the Google Fonts stylesheet.

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
js/app.js                 state, ritual flow, life score, journal, AI memory, nav
manifest.webmanifest      PWA manifest
sw.js                     offline service worker
icons/                    app icons (svg + png, incl. maskable + apple-touch)
```
