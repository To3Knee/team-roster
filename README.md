
# Team Contact Roster (Business Card Sized)

Create wallet‑ready, business‑card sized contact cards for your team — with **drag‑to‑reorder**, **CSV import/export**, **themes**, and **true 85.6 × 54 mm** output for laminating.

> Two ways to use:
> 1) **Browser HTML (offline)** — double‑click `team-contact-roster-offline.html` (no install).  
> 2) **Offline Desktop App** — Electron project you can build into a portable `.exe`.

---

## ✨ Features

- **True CR80 size** (85.6 mm × 54 mm / 3.375″ × 2.125″).
- **Front:** Team roster (`Name`, `Phone`, `Cell`) — fits ~14 lines.
- **Back:** Quick contacts with **editable title** (e.g., “On‑Call Info”, “Ops Hotlines”).
- **Drag to reorder** members and quick numbers.
- **CSV import/export** for members (`Name,Phone,Cell`).
- **Persistence**: Saved locally via `localStorage` (survives refresh/reopen).
- **Theming** + font scaling for tight fits.
- **Print tiling** for multiple copies per sheet + built‑in **duplex (front/back) layout**.
- **No backend required.**

---

## 🧰 Repo Layout

```
/browser-offline/
  team-contact-roster-offline.html   # ready-to-run single-file version

/electron-src/
  index.html           # offline UI shell (no CDNs)
  app.css
  app.js               # vanilla JS: drag, persistence, CSV, print, etc.
  main.js              # Electron main
  package.json
  build-win.ps1        # helper script for Windows
```

> If you only want the web page: keep **`/browser-offline/team-contact-roster-offline.html`**.  
> If you want a Windows `.exe`: use **`/electron-src/`**.

---

## 🚀 Quick Start (Browser HTML)

1. Open **`/browser-offline/team-contact-roster-offline.html`** in Chrome/Edge/Firefox.  
2. Enter team members, add Quick Numbers, and drag rows to order.
3. Change **Back Title** — the (drag to reorder) section header updates automatically.
4. Click **Print / Save PDF** → enable **Two‑sided** with **Flip on long edge**.

**CSV tips**
- Export members: **Export Members CSV**.
- Import members: **Import Members CSV** with the header:
  ```csv
  Name,Phone,Cell
  Jane Smith,555-123-4567,555-987-6543
  John Doe,555-000-1111,555-222-3333
  ```
- Data persists locally in your browser (`localStorage`).

---

## 🖥️ Offline Desktop App (Electron)

A self‑contained desktop app (no CDNs at runtime). Build once, share a **portable `.exe`** with your team.

### Prerequisites
- **Windows 10/11**  
- **Node.js LTS** from https://nodejs.org (one‑time download to build)

### Build & Run
Open **PowerShell** in `/electron-src`:

```powershell
# 1) Install dependencies (one-time; downloads Electron locally)
npm install

# 2) Run in a desktop window
npm start

# 3) Build a portable .exe in .\dist\
npm run pack
```

The built app will appear as something like:
```
dist/
└─ TeamContactRoster-win32-x64/
   ├─ TeamContactRoster.exe   # portable, no install
   └─ ...
```

> Runtime is **completely offline**. All assets are bundled inside the `.exe` folder.

### Printing
- Click **Print / Save PDF** inside the app.
- Use **Two‑sided** / **Flip on long edge** to align front/back.
- Page 1 = Front (tiled), Page 2 = Back (tiled).

---

## 🧪 Usage Notes & Examples

### CSV format (members)
```csv
Name,Phone,Cell
Alice Benson,555-111-2222,555-333-4444
Bob Carter,555-222-3333,555-444-5555
```

### Reordering
- **Drag any row** (members or quick numbers) to the new position. The **Preview** and **Print** layouts follow that order.

### Persistence
- Changes are saved to `localStorage`. Each build (browser or Electron) uses its own storage key.
- Clearing site data or running in incognito/private mode will remove saved entries.

### Printing & Paper
- Use standard letter paper with a laminator and a card trimmer/cutter.
- For business‑card stock (e.g., Avery 8871), the card size matches CR80; tiled print offers precise trimming.

---

## ⚙️ Configuration & Customization

- **Title fields**: `Front Title` & `Back Title` (renames the section header automatically).
- **Themes**: Slate, Emerald, Indigo, Rose, Amber.
- **Font Scale**: 0.85 – 1.20 (reduce for long names/phones).
- **Copies per sheet**: 1–12 (front & back auto‑tile).

**Nice-to-haves** (open an issue or PR):
- Logo slot or QR (e.g., to an on‑call runbook).  
- JSON import/export.  
- Per‑member role/notes or extensions.  
- Avery stock presets (8871, etc.).

---

## 🔍 Troubleshooting

- **White screen on open**: If you edited files, ensure valid JSON/CSV and no stray quotes. Try `npm start` from a terminal to see logs.
- **Nothing prints on back**: Confirm **Two‑sided** and **Flip on long edge** are checked.
- **Data not saving**: Private/Incognito windows disable persistent storage; use a normal session.
- **CSV import mismatch**: Confirm exact headers: `Name,Phone,Cell`. Quoted fields are supported.

---

## 📦 Version History

- **v1.3.1** — Rename to “Team Contact Roster (Business Card Sized)”, centered Import button, dynamic back section header.  
- **v1.3** — Import button match/center, rename away from “credit card”.  
- **v1.2** — Persistence, CSV import/export, editable back title, wider UI, drag‑to‑reorder.  
- **v1.0** — Initial release.

