# Day Planner

**Live app:** https://gayan-kangaraarachchi.github.io/day-planner/

A small web app for planning the day, with no dependencies: work blocks, evening gym, a 10,000-step walking goal, meals and cooking, water, and a shopping list. You can install it on your phone's home screen and it works offline.

## Features

- **Schedule:** a time-blocked day with separate weekday and weekend templates. Tap a block to edit it, and tick it off when it's done. The current block is highlighted.
- **Walking:** a step counter with a 10,000-step goal ring and a chart of the last 7 days.
- **Workout:** a suggested workout for each weekday (Monday push, Tuesday pull, Wednesday legs, Thursday cardio and core, Friday full body, Saturday active recovery, Sunday rest) as a checklist.
- **Meals & cooking:** breakfast, lunch, dinner and snacks for each day.
- **Water:** 8 glasses (2 L) per day.
- **Shopping list:** one list that stays the same across all days.
- **Linked apps:** the Workout card opens **Liftlog** and the Shopping list opens **Pantrylog**.
- **Languages:** English (default), Finnish and Swedish. Choose one from the menu at the top. Dates and numbers follow the chosen language.
- Light and dark themes that follow your device settings.

## Install on your phone

1. Open https://gayan-kangaraarachchi.github.io/day-planner/ on your phone.
2. Add it to the home screen:
   - **iPhone (Safari):** tap Share → **Add to Home Screen**.
   - **Android (Chrome):** tap ⋮ → **Install app** (or **Add to Home screen**).

It opens full screen with its own icon and works without an internet connection.

## Project structure

```
day-planner/
├── index.html              # Page layout only
├── manifest.webmanifest    # App name, colours and icons for the home screen
├── sw.js                   # Service worker: offline cache
├── css/
│   └── styles.css          # All styles (light and dark colour settings)
├── js/
│   ├── app.js              # Entry point: startup and event handling
│   ├── render.js           # Builds the page from the saved data
│   ├── store.js            # Saving to localStorage and the per-day data model
│   ├── config.js           # Categories, workouts, weekday/weekend templates (no text)
│   ├── i18n.js             # Language list, translation lookup, date/number formatting
│   ├── utils.js            # Date, DOM and text helpers
│   └── locales/
│       ├── en-GB.js        # English (default and fallback)
│       ├── fi-FI.js        # Suomi
│       └── sv-SE.js        # Svenska
└── icons/
    ├── favicon.svg
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png   # Android adaptive icon
    └── apple-touch-icon.png    # iPhone / iPad home screen (180×180)
```

## Run locally

The JavaScript uses ES modules, so serve the folder instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

## Linked apps

The Workout and Shopping list cards each have a button that opens a companion app in a new tab:

| Card          | App       | Link set in `js/config.js` → `LINKED_APPS` |
|---------------|-----------|--------------------------------------------|
| Workout       | Liftlog   | `workout.url`                              |
| Shopping list | Pantrylog | `shopping.url`                             |

Both currently point to the apps' claude.ai artifact pages, so you need to be signed in to claude.ai in the browser that opens them. If you host either app somewhere else (for example on GitHub Pages), replace its `url`. Leave a `url` empty to hide that button.

## Languages

| Code    | Shown in menu | Notes                          |
|---------|---------------|--------------------------------|
| `en-GB` | English       | Default; fallback for any missing text |
| `fi-FI` | Suomi         |                                |
| `sv-SE` | Svenska       |                                |

The chosen language is remembered on each device. All visible text lives in `js/locales/`. The HTML marks translatable elements with `data-i18n` (text), `data-i18n-placeholder` and `data-i18n-aria` (screen-reader label).

Schedule blocks and shopping items that come from the built-in templates switch language along with the app. Anything you type yourself, or a template block you've edited, stays exactly as written.

### Add another language

1. Copy `js/locales/en-GB.js` to a new file, for example `js/locales/de-DE.js`, and translate the values. Keep the keys and any `{n}` / `{t}` placeholders unchanged.
2. In `js/i18n.js`, import the file and add it to `LANGUAGES` with the name to show in the menu:
   ```js
   import deDE from './locales/de-DE.js';
   // ...
   'de-DE': { name: 'Deutsch', strings: deDE },
   ```
3. Add `'./js/locales/de-DE.js'` to `ASSETS` in `sw.js` and update the cache version.

Any text missing from a translation falls back to English.

## Make changes and publish

The site is hosted on GitHub Pages from the `main` branch (root folder). Any push to `main` updates the live app within a minute or two.

1. Edit the files:
   - Schedule times, categories or which workout falls on which day → `js/config.js`
   - Wording of any text (all languages) → `js/locales/*.js`
   - Colours and fonts → the `:root` block at the top of `css/styles.css`
2. **Update the cache version** in `sw.js` (for example `day-planner-v1` → `day-planner-v2`). Without this, phones that installed the app keep showing the old version.
3. Commit and push:

   ```bash
   git add .
   git commit -m "Describe your change"
   git push
   ```

4. On your phone, close the app completely and open it again to load the new version.

## Data and privacy

Everything is saved in the browser's `localStorage` on each device. Nothing is sent to a server.

- Data does **not** sync between devices. Your phone and laptop each keep their own copy.
- Clearing the browser's site data, or removing the app from the home screen on iPhone, erases it.

## Repository

https://github.com/gayan-kangaraarachchi/day-planner
