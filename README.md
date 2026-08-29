# Morning OS

A calm daily wellness PWA — bilingual Arabic (RTL) / English (LTR) with instant switching.

Design language: a bold, colorful Bento-grid dashboard — a warm cream base with
saturated flat card colors (mustard, sage, blush, lavender, coral), heavy Manrope/
Tajawal display type, pill buttons, and a floating dark bottom nav. The home screen's
hero card still shifts color with the time of day (mustard mornings, sage afternoons,
coral evenings, lavender nights).

## Features

Morning OS is built around one idea: instead of scattered, disconnected habits,
one system links your whole life — an **external environment** (four daily
pillars) and an **internal environment** (the deeper layer underneath them) —
with a science-grounded reason for each.

- **Morning Ritual** — a short guided flow each day: three slow breaths, an "inner
  weather" mood + energy check-in, an intention, and a gratitude note.
- **External environment — Performance** — four standalone daily programs
  (Sleep, Nutrition, Movement, Social Connection), each its own screen. Every
  day surfaces one lesson from a 9-step curriculum that deepens tier by tier
  (foundational → building → advanced) as the domain's "Day N" count grows —
  action, the physiological/psychological "why," the realistic upside of
  keeping it up, and the realistic cost of skipping it.
- **Internal environment** — the deeper layer: daily psychological state
  (captured through the ritual's mood/energy check-in), a **Digital
  Boundaries** check-in rating how intentional today's screen use felt, and
  Brain Dump journal entries that can optionally log the *trigger* behind a
  feeling, not just the feeling itself.
- **Life Map** — a radar visualization on the home screen that unifies the
  four external pillars into one glance, with the internal layer summarized
  at its center, instead of separate disconnected lists.
- **Momentum** — replaces the old hard streak count. Consistency builds it up,
  a missed day only dips it gently instead of resetting to zero — so one off
  day doesn't undo a month of showing up.
- **Life Score** — a single 0–100 score built from the four external pillars
  plus the internal layer (mood, journaling, digital boundaries), with a
  breakdown and 7/14/30-day history charts.
- **Brain Dump Journal** — a free-write space with mood tagging, an optional
  trigger field, search, and a running entry history.
- **AI Memory** — an on-device, rule-based reflection companion. It notices
  patterns (momentum, recurring journal keywords, mood trends) and chats using
  local templates — nothing is sent to a server.
- **What's New (Premium)** — a rotating research digest across sleep,
  nutrition, movement, and social connection, each finding turned into a
  one-tap experiment. One item is free daily; the full digest is gated behind
  a premium unlock. Since this is a local-only app with no backend, the
  unlock is an honest client-side demo toggle rather than a real payment flow
  — a real product would wire this to App Store/Play Store billing.

All data (ritual history, journal entries, chat log, performance history,
digital-boundary check-ins, settings) is stored only in the browser's
`localStorage`. There is no backend, no accounts, and no network calls other
than loading the Google Fonts stylesheet.

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
