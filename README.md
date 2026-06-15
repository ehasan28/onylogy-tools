# Onylogy Tools

**Small, sharp tools for the web.** A growing collection of fast, focused utilities for developers and designers — placeholder copy, CSS unit conversion, fluid typography, and text transformation. Everything runs entirely in your browser; nothing is ever uploaded.

🔗 **Live:** https://text-generator-rouge.vercel.app

---

## Overview

Onylogy Tools is a single-page-app suite of four client-side web-dev utilities, each on its own route under a shared, themeable shell. There is no backend, no account, and no tracking — every tool computes its result locally in the browser.

| Tool | Route | What it does |
|------|-------|--------------|
| Copy Generator | `/copy-generator` | Generate placeholder text and mock data |
| PX Converter | `/px-converter` | Convert pixels ↔ rem |
| Clamp Generator | `/clamp-generator` | Build fluid `clamp()` font sizes |
| Convert Case | `/convert-case` | Transform text between letter cases |

---

## Tools

### 🅐 Copy Generator — `/copy-generator`

Generate realistic placeholder content from **16 generators**, grouped by purpose:

- **Text:** Meaningful English, Random English Words, Lorem Ipsum, Hipster Ipsum, Corporate Buzzwords
- **Web Dev:** HTML Markup, Markdown, JSON Mock Data
- **Identifiers:** UUIDs (v4), Emails, URL Slugs, URLs, Names, Random Characters
- **Design:** HEX Colors, CSS Class Names

Features:

- Output by **words**, **sentences**, or **paragraphs**, with quick count presets
- **Formatting** controls: letter case (Original / Sentence / Title / UPPER / lower), line breaks, and optional HTML `<p>` wrapping
- **Live stats:** words, characters, characters without spaces, sentences, paragraphs, and estimated reading time
- **History** of recent generations that persists across reloads (via `localStorage`)
- One-click **Copy**, **Download** as `.txt`, **Reset** (enabled only when settings drift from defaults), and **Clear**

### 🅑 PX Converter — `/px-converter`

A bidirectional pixel-to-rem converter.

- Edit either field — **px → rem** and **rem → px** stay in sync
- **Swap** the two sides to lead with whichever unit you prefer
- Configurable **root font-size** (base), defaulting to 16px
- Common pixel **presets** for one-click values
- Copy either value independently

### 🅒 Clamp Generator — `/clamp-generator`

Generate a fluid `font-size` that scales linearly between two viewport widths using CSS `clamp()`.

- Set **min/max viewport width** and **min/max font size**, each in `px` or `rem`
- **Live preview** of the full declaration: `font-size: clamp(…)`
- **Copy** gives the clean `clamp(…)` value only — no `font-size:` prefix — so it drops straight into Elementor, WordPress, or any CSS field
- Sensible defaults (420px → 1200px viewport, 16px → 48px font)

### 🅓 Convert Case — `/convert-case`

Paste any text and convert it between **10 cases**: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and aLtErNaTiNg. Includes live word/character counts and one-click copy.

---

## Highlights

- **100% client-side** — no servers, no uploads, no analytics. Your text never leaves your machine.
- **Light & dark themes** — follows your system preference with a manual toggle, persisted between visits.
- **Responsive & accessible** — keyboard-friendly controls, ARIA labels, and a layout that adapts from mobile to desktop.
- **Premium, minimal design** — Space Grotesk headings, Inter body, JetBrains Mono for code, and a refined monochrome palette with a single emerald accent.

---

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack)
- **[React 19](https://react.dev)**
- **[TypeScript](https://www.typescriptlang.org)**
- **[Tailwind CSS v4](https://tailwindcss.com)**
- **[lucide-react](https://lucide.dev)** icons
- **[next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)** (Space Grotesk, Inter, JetBrains Mono)
- Deployed on **[Vercel](https://vercel.com)**

---

## Getting started

```bash
# clone
git clone https://github.com/ehasan28/onylogy-tools.git
cd onylogy-tools

# install
npm install

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, shared nav + footer
│   ├── page.tsx                # Landing page (tool hub)
│   ├── globals.css             # Theme tokens (monochrome + emerald) & base styles
│   ├── icon.svg / favicon.ico  # Branding
│   ├── opengraph-image.png     # Social share card
│   └── (tools)/                # Route group for the four tools
│       ├── copy-generator/
│       ├── px-converter/
│       ├── clamp-generator/
│       └── convert-case/
├── components/                 # UI: shell (nav/footer), tool components, shared primitives
├── generators/                 # The 16 copy generators + registry
├── hooks/                      # useTheme, useHistory
└── lib/                        # case, css-units, stats, format, history helpers
```

---

## Privacy

Onylogy Tools is fully client-side. There is no backend, no database, and no third-party analytics. Generated content, converted text, and history all stay in your browser (history uses `localStorage` on your device only).

---

## Credits

Built by **[Onylogy](https://onylogy.com)**.
