# TOEIC Master Pro — macOS Desktop App

A thin [Tauri v2](https://tauri.app) shell around the same web app that runs
on Vercel. `scripts/sync-web.js` copies `index.html`, `login.html`, and
`assets/` from the repo root into `dist/` at build time, so the desktop app
always ships the current web code with **zero code duplication**.

## Requirements
- macOS with Xcode command-line tools
- Rust (`rustup`), Node.js

## Build

```bash
cd desktop
npm install
npm run build        # -> src-tauri/target/release/bundle/macos/TOEIC Master Pro.app
                     # -> src-tauri/target/release/bundle/dmg/TOEIC Master Pro_*.dmg
```

`npm run dev` opens a live dev window.

After changing web code in the repo root, just rebuild — the sync script
runs automatically before every build.

## Notes
- The service worker is web-only; the app skips SW registration when not
  running on http/https (guards in `assets/js/app.js` and `assets/js/pwa.js`).
- Progress currently lives in the WKWebView's localStorage (per-machine).
  Cross-device sync arrives with the Supabase backend phase.
- The `.app` is unsigned by default: on first launch, right-click → Open
  (or System Settings → Privacy & Security → Open Anyway). With an Apple
  Developer ID certificate, sign + notarize for a clean first launch.
