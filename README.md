# Northbridge — Corporate Site + Admin Console

A responsive **company profile website** with a matching **admin console**, built in pure
vanilla **HTML / CSS / JavaScript** — no framework, no build step. Open the files and it runs.

> Placeholder brand, copy, and imagery ("Northbridge Group") — swap freely for any client.

---

## ✨ Features

### Public landing site (`index.html`)
- Sticky nav with smooth-scroll and active-section highlighting
- Hero, client logos, about, 6 services, stats band, projects, leadership team, testimonials, contact form, footer
- Fully **responsive**: on mobile it becomes a **tab-filtered app** with a bottom nav (Home / Services / Work / Contact)

### Admin console (`admin.html`)
- **Login screen** — demo credentials pre-filled (`admin@gmail.com` / `admin123`); click **Sign in** to enter
- Six panels: **Overview** (KPIs + charts), **Content** (publish/hide section toggles), **Messages** (inbox + reader), **Team**, **Projects** (table), **Settings**
- Responsive: dark **sidebar** on desktop → **bottom nav** on mobile; tables collapse to cards, split inbox becomes an accordion

### Everything is vanilla JS
Panel switching, smooth-scroll nav, mobile tabs, inbox selection, live publish/hide toggles,
and the settings switches all run on plain JavaScript with a single shared state model per app.

---

## 📁 Project structure

```
.
├── index.html          Public landing site (desktop + mobile layouts)
├── admin.html          Admin console (login + desktop + mobile layouts)
├── css/
│   ├── styles.css      Design tokens + landing styles
│   └── admin.css       Admin console styles
├── js/
│   ├── landing.js      Landing data render, nav scroll, mobile tabs
│   └── admin.js        Admin data + shared state (auth, panels, toggles, inbox)
└── assets/             Generated placeholder imagery (hero, about, 4 project photos)
```

---

## 🚀 Getting started

No dependencies. Either:

**Open directly** — double-click `index.html`.

**Or serve locally** (recommended, so images and links resolve cleanly):

```bash
# Python 3
python -m http.server 5510

# or Node
npx serve .
```

Then visit <http://127.0.0.1:5510/index.html>.
Click **Log in** (top-right) to reach the admin console, or open `admin.html` directly.

---

## 📱 Responsive behaviour

| Breakpoint            | Landing                                   | Admin                                      |
| --------------------- | ----------------------------------------- | ------------------------------------------ |
| **Desktop (≥1024px)** | Full scrolling page, top nav              | 248px dark sidebar + 6 panels, split inbox |
| **Mobile (<768/900)** | Tab-filtered, bottom nav (4 tabs)         | Bottom nav (5 tabs), cards + accordion     |

Landing content is capped at **1280px** and centered on wide screens (backgrounds stay full-bleed).

---

## 🎨 Customization

- **Brand colour** — change `--brand` (and friends) in `css/styles.css` `:root`. Everything re-themes from that one token.
- **Fonts** — Sora (headings) + Instrument Sans (body), loaded from Google Fonts.
- **Content** — copy lives in the HTML and in the data arrays inside `js/landing.js` and `js/admin.js`.
- **Images** — drop your own photos into `assets/` using the same filenames, or update the paths.

---

## 🔐 Admin demo access

The login is a front-end demo only — no real authentication.

```
Email:    admin@gmail.com
Password: admin123
```

Credentials are pre-filled; clicking **Sign in** always enters. Session is remembered
via `sessionStorage`; **Sign out** returns to the login screen.

---

## 📄 License

Proprietary — Kiyo Software Tech Lab. Placeholder content is for demonstration.
