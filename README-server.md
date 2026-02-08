# `server.js` (moved)

`server.js` has been moved into `scripts/server.js` to keep the repo root focused on the static site.

How to run the server locally:

```bash
node scripts/server.js
```

Notes:
- This is a simple Node static file server for local development only.
- GitHub Pages cannot run `server.js` — it only serves static files.
- If you want to deploy the site to GitHub Pages, keep the static files (`index.html`, `css/`, `js/`, `pages/`, `images/`) and remove server-specific routing or convert pages to folder/index.html for clean URLs.

Restore or undo:
- The original `server.js` was kept in `scripts/`. If you want it back at the repo root, move it back manually or run:

```bash
git mv scripts/server.js server.js
```

Optional: add an `npm start` script by creating a `package.json` with:

```json
{
  "name": "moksh-delights",
  "version": "1.0.0",
  "scripts": {
    "start": "node scripts/server.js"
  }
}
```
