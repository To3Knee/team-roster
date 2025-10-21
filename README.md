
# Team Contact Roster (Business Card Sized)

Create wallet‑ready, business‑card sized contact cards for your team — with **drag‑to‑reorder**, **CSV import/export**, **themes**, and **true 85.6 × 54 mm** output for laminating.

> Two ways to use:
> 1) **Browser HTML (offline)** — double‑click `team-contact-roster-offline.html` (no install).  
> 2) **Offline Desktop App** — Electron project you can build into a portable `.exe`.

---

## ✨ What’s new in v1.3.3
- **No tip on print/PDF** — the small “Tip: Laminate…” line is still visible in the live preview but **hidden from print/PDF**.
- Kept all v1.3.2 fixes: print‑only sheets, up to **16 rows** on the front, **2‑column** back layout, and **Quick Numbers CSV** import/export.

---

## Features (highlights)
- **True CR80 size** (85.6 × 54 mm / 3.375″ × 2.125″).
- **Front:** Team roster (`Name`,`Phone`,`Cell`) — up to **16 rows**.
- **Back:** Editable title + cleaner 2‑column layout (Label / Value).
- **Drag to reorder** (members + quick numbers).
- **CSV import/export** for both sections:
  - Members: `Name,Phone,Cell`
  - Quick Numbers: `Label,Value`
- **Persistence** (`localStorage`), **Themes**, **Font scaling**, **Copies per sheet**.
- **Print‑only sheets**: Editor UI and tip are hidden; only tiled Front (page 1) & Back (page 2) render.

---

## Repo Layout
```
/browser-offline/
  team-contact-roster-offline.html   # single-file offline HTML

/electron-src/
  index.html           # offline UI (no CDNs)
  app.css
  app.js               # vanilla JS: drag, persistence, CSV, print, etc.
  main.js              # Electron main
  package.json
  build-win.ps1        # helper script for Windows
```

> Yes: the **offline HTML is one file**.  
> Yes: the **.exe source** is multiple files (Electron project).

---

## Quick Start (Browser HTML)
1. Open **`/browser-offline/team-contact-roster-offline.html`** in Chrome/Edge/Firefox.
2. Enter members & quick numbers; drag to order.
3. Change **Back Title** — the section header updates automatically.
4. Click **Print / Save PDF**.

**Printing checklist**
- Expect **2 pages**: Page 1 = **Front tiles**, Page 2 = **Back tiles**.
- **Two‑sided** ON, **Flip on long edge**.
- Scale/Zoom **100%**; Margins **Default/Normal**.

---

## Offline Desktop App (Electron)
Open **PowerShell** in `/electron-src`:
```powershell
npm install
npm start
npm run pack   # builds portable .exe in .\dist```
Output:
```
dist\TeamContactRoster-win32-x64\TeamContactRoster.exe
```

---

## CSV Examples
**Members:**
```csv
Name,Phone,Cell
Jane Smith,555-123-4567,555-987-6543
John Doe,555-000-1111,555-222-3333
```
**Quick Numbers:**
```csv
Label,Value
Help Desk,555-100-2000
Support Line,555-300-4000
On-Call Escalation,555-777-8888
```

---

## Version History
- **v1.3.3** — Hide tip on print/PDF; retain v1.3.2 improvements.
- **v1.3.2** — Print‑only sheets; up to 16 rows; 2‑column back; Quick Numbers CSV import/export.
- **v1.3.1** — Rename; centered Import button; dynamic back header.
- **v1.3** — Import button match/center; terminology cleanup.
- **v1.2** — Persistence, Members CSV, editable back title, wider UI, drag‑to‑reorder.
- **v1.0** — Initial release.
