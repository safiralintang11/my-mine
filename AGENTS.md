# Project notes

Portfolio site for Safira Lintang Zhahrani — Flask + SQLAlchemy, server-rendered templates, animated with GSAP, Swiper, Motion One, and Three.js.

## Run locally

```bash
python -m venv .venv
.venv/Scripts/activate        # Windows (bash: source .venv/Scripts/activate)
pip install -r requirements.txt
python app.py                 # http://127.0.0.1:5000
```

`init_db()` runs on import: it creates tables, adds new columns to existing
tables (SQLite or PostgreSQL), seeds the profile, and inserts the featured
projects if they are missing.

## Layout

- `app.py` — routes `/` and `/portofolio`, lightweight column migrations.
- `models.py` — `Profile`, `Experience`, `Project`, `Education`, `Award`,
  `Skill`, `Certificate`, `Documentation`.
- `seed.py` — initial content. `FEATURED_PROJECTS` are the live projects that
  appear in the Swiper carousel.
- `templates/base.html` — shared shell, nav, footer, CDN scripts, page
  transition layer.
- `templates/index.html`, `templates/portfolio.html`, `templates/partials/_works.html`.
- `static/css/style.css` — all styles.
- `static/js/main.js` — reveals, page transitions, Swiper, GSAP, Motion One,
  lightbox.
- `static/js/flower3d.js` — Three.js flower, lazily imported when the
  playground section approaches the viewport.

## Content rules

- A `Project` with a non-empty `url` is shown in the “Portofolio pilihan”
  carousel; projects without a URL are shown in the focus grid.
- `Project.theme` controls the cover treatment: `ink` (dark, logo directly on
  the cover), `leaf` / `earth` (light, logo inside a white plate), or
  `blush` (default).
- Certificate/documentation rows use `image` paths relative to `/static`
  (e.g. `images/sertifikat/foo.jpg`); the archive gallery opens them in a
  `<dialog>` lightbox.
- Front-end libraries load from jsDelivr; the page still renders if they fail
  (reveal fallback + `window.__slzReady` safety timer).
