# SM Tools Hub
Vanilla HTML/CSS/JS developer tools. No build step, no backend.

## Deploy (GitHub Pages)
1. Push all files in this folder to a public repo (root of `main`).
2. Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)` → Save.
3. Open `https://<user>.github.io/<repo>/`.

## Add a tool
Add one `t(id, category, name, description, sample, fn, option?)` line in `script.js`. `fn(input, option)` returns a string (sync or async) or throws an Error.

## Status (v0.1)
- Done: ~50 tools, search, category filter, favorites, recents, dark mode, hash routing, copy/clear/download.
- Not yet: remaining ~100 tools, Bengali/English toggle, image tools, JS minifier/formatter, SQL, Git/README generators, snippet manager/notepad/to-do, automated tests.
- Limits: JWT decoder does not verify signatures; CSV parser is basic; HTML/CSS minifiers are regex-based.
