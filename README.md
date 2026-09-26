# Villa Enquiry Landing Page

A premium, Airbnb-inspired property landing page with a built-in enquiry form.
Built for direct bookings — share the link with prospective guests so they can submit
their mobile number and you can contact them off-platform.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What's where

```
src/
  App.jsx       ← single-file page: property data + UI + form + handleSubmit()
  index.css     ← Tailwind entry
  main.jsx      ← React mount
```

### Editing the property
Open `src/App.jsx` and edit the `property` object at the top of the file:
- `name`, `tagline`, `location`, `shortDescription`
- `images` — array of image URLs (any host; Unsplash works as a placeholder)
- `highlights` — guests / bedrooms / beds / bathrooms
- `amenities` — `{ icon, label }` pairs (icons available: `pool, wifi, kitchen, parking, tv, fireplace, view, ac, breakfast, housekeeping`)
- `pricing` — `perNight`, `currency`, `note`
- `rules` — array of strings
- `hostWhatsapp` — international format, no `+` (e.g. `919999999999`) for the WhatsApp deep-link

### Wiring the form to a real backend
The form's submit handler is at the top of `App.jsx`:

```js
async function handleSubmit(payload) { ... }
```

It currently logs to the console. Inline comments show drop-in patches for:
- **EmailJS**
- **Firestore**
- **Google Sheets / Zapier / Make webhook**

For webhooks, set `VITE_WEBHOOK_URL` in `.env.local` and uncomment the `fetch` block.

### WhatsApp redirect
After a successful submit the user sees a *Continue on WhatsApp* button that opens
`wa.me/<hostWhatsapp>` pre-filled with the enquiry summary.

## Tech
- React 18 + Vite
- Tailwind CSS 3
- No backend, no database (Phase 1)
