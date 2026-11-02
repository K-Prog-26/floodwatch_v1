# FloodWatch

Community flood map with safe routing and turn-by-turn navigation.

## Folder layout
- `docs/` – the whole app (this folder is what gets hosted, and what the Android build will use later)
  - `index.html` – the app (put your keys at the top of its script)
  - `manifest.webmanifest`, `sw.js`, `icon-*.png` – make it installable on phones

## Put it online with GitHub Pages
1. Create a new repository on github.com (e.g. `floodwatch`).
2. Upload everything in this folder (keep the `docs` folder).
3. Repository **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, branch **main**, folder **/docs**, then Save.
4. After a minute your app is live at `https://YOUR-USERNAME.github.io/floodwatch/`.

## Add your keys
Open `docs/index.html` and fill in near the top of the script:
- `TOMTOM_KEY` – from developer.tomtom.com
- `ORS_KEY` – optional, from openrouteservice.org
- `DB` – optional, your Firebase Realtime Database URL (for live shared reports)

In your TomTom dashboard, add `YOUR-USERNAME.github.io` as an allowed domain for the key.

## Install on a phone
Open the live address in Chrome on Android, tap the ⋮ menu, then **Install app** (or **Add to Home screen**).
