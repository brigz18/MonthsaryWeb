# Our Love Story — Roi & Baby

A private, offline-first scrapbook website: HTML, CSS and vanilla JavaScript only.

## Open it
Double-click `index.html` (Chrome, Edge or Firefox). No server or internet needed.

## Structure
- `index.html`, `css/style.css`, `js/script.js` — the site
- `assets/images` — your photos; `assets/music` — local audio; `assets/icons` — optional icons
- `data/memories.json` — example of the import/export format

## Adding photos
1. **Referenced files:** copy photos into `assets/images`, then in Memories → Add memory type the path, e.g. `assets/images/first-date.jpg`. These stay in the project folder.
2. **Picked from your computer:** shrunk and stored in this browser's IndexedDB. They are NOT copied into the project folder.

## Stories, letters, dates, songs
Use the Add / Edit buttons in each section. Deleting always asks first. Date recurrence handles short months and leap years (Feb 29 falls on Feb 28 in non-leap years).

## Backups
Memories → **Export JSON** downloads everything, including browser-stored photos. **Import JSON** validates the file, then replaces current data after confirmation. Also copy the whole folder to back up `assets/`. Clearing browser data erases browser-stored content, so export often.

## Privacy
Nothing is uploaded anywhere. The passcode screen is a keepsake only: anyone with the files or browser data can bypass it. For real privacy, host the folder on a password-protected server or private hosting.

## Known limitations
- Browser storage is per browser and per file location; opening the site from a different folder or browser shows a separate (empty) copy. Use Export/Import to move.
- Notifications and reminders are not sent; reminder notes are display-only.
- Copying uploaded photos into the project folder automatically needs a local Node.js helper, which is not included in this first version.
