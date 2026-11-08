# Day Planner

A small, dependency-free web app for planning the day: work blocks, evening gym, a 10,000-step walking goal, meals and cooking, water, and a shopping list. It can be installed to a phone's home screen and works offline.

## Project structure

```
day-planner/
├── index.html              # Markup only
├── manifest.webmanifest    # App name, colours and icons for "Add to Home Screen"
├── sw.js                   # Service worker: offline cache
├── css/
│   └── styles.css          # All styles (light + dark theme tokens)
├── js/
│   ├── app.js              # Entry point: event wiring and startup
│   ├── render.js           # State → DOM
│   ├── store.js            # localStorage persistence and the per-day data model
│   ├── config.js           # Categories, workout splits, weekday/weekend templates
│   └── utils.js            # Date, DOM and string helpers
└── icons/
    ├── favicon.svg
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png   # Android adaptive icon
    └── apple-touch-icon.png    # iPhone / iPad home screen (180×180)
```

## Run locally

The JavaScript uses ES modules, so open it through a local server rather than double-clicking `index.html`:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Put it on GitHub

```bash
git init
git add .
git commit -m "Day Planner: initial version"
git branch -M main
git remote add origin https://github.com/<your-user>/day-planner.git
git push -u origin main
```

### Host it with GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. After a minute the app is live at `https://<your-user>.github.io/day-planner/`.

Home-screen install and offline mode need HTTPS, which GitHub Pages provides.

## Add to your phone's home screen

- **iPhone (Safari):** open the site → Share button → **Add to Home Screen**.
- **Android (Chrome):** open the site → ⋮ menu → **Add to Home screen** / **Install app**.

It then opens full screen with its own icon, like a native app.

## Customising

- Change the daily schedule, workouts or starter shopping items in `js/config.js`.
- Change colours and fonts in the `:root` block at the top of `css/styles.css`.
- After changing any file, bump `CACHE` in `sw.js` (e.g. `day-planner-v2`) so installed copies update.

## Data

Everything is stored in the browser's `localStorage` on each device. Data does not sync between devices, and clearing site data erases it.
