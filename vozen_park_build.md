# VOZENPARK COMPLETE BUILD PROMPT FOR CURSOR
## Copy-Paste This Entire Prompt Into Cursor Agent

---

## CONTEXT

You are building **VozenPark** - a Progressive Web App (PWA) vehicle reminder system.

**Core functionality:**
- Users enter vehicle plates + expiry dates (registration, insurance, technical inspection)
- System sends email reminders: 30 days before, 7 days before, 1 day before, on expiry
- Users see dashboard with color-coded status (ðŸ”´ urgent, ðŸŸ¡ soon, ðŸŸ¢ ok)

**Languages:** English, Macedonian (default), Albanian, Turkish, Serbian  
**Format:** PWA (installable on mobile) + Responsive (mobile-first)  
**Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma, PostgreSQL
**App Name:** VozenPark

---

## STEP 1: PROJECT INITIALIZATION

Create a new Next.js 14 project with these exact settings:

```bash
npx create-next-app@latest vozenpark \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --use-npm \
  --no-git

cd vozenpark

npm install next-i18next \
  react-hook-form \
  @hookform/resolvers \
  zod \
  resend \
  zustand \
  workbox-window \
  date-fns \
  bcryptjs \
  @types/bcryptjs \
  sonner \
  lucide-react

npm install -D @types/node @types/react
```

---

## STEP 2: FOLDER STRUCTURE

Create this exact folder structure in your `src/` directory:

```
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ (auth)/
â”‚   â”‚   â”œâ”€â”€ login/page.tsx
â”‚   â”‚   â”œâ”€â”€ signup/page.tsx
â”‚   â”‚   â””â”€â”€ layout.tsx
â”‚   â”œâ”€â”€ dashboard/page.tsx
â”‚   â”œâ”€â”€ vehicles/
â”‚   â”‚   â”œâ”€â”€ new/page.tsx
â”‚   â”‚   â””â”€â”€ [id]/edit/page.tsx
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ auth/signup/route.ts
â”‚   â”‚   â”œâ”€â”€ auth/login/route.ts
â”‚   â”‚   â”œâ”€â”€ auth/logout/route.ts
â”‚   â”‚   â”œâ”€â”€ vehicles/route.ts
â”‚   â”‚   â”œâ”€â”€ vehicles/[id]/route.ts
â”‚   â”‚   â””â”€â”€ cron/send-reminders/route.ts
â”‚   â”œâ”€â”€ offline/page.tsx
â”‚   â”œâ”€â”€ layout.tsx
â”‚   â”œâ”€â”€ page.tsx
â”‚   â”œâ”€â”€ globals.css
â”‚   â”œâ”€â”€ manifest.json
â”‚   â”œâ”€â”€ middleware.ts
â”‚   â””â”€â”€ service-worker.ts
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Header.tsx
â”‚   â”œâ”€â”€ LanguageSelector.tsx
â”‚   â”œâ”€â”€ VehicleTable.tsx
â”‚   â”œâ”€â”€ VehicleForm.tsx
â”‚   â”œâ”€â”€ StatusCard.tsx
â”‚   â”œâ”€â”€ StatusBadge.tsx
â”‚   â”œâ”€â”€ ServiceWorkerRegistry.tsx
â”‚   â””â”€â”€ LoadingSpinner.tsx
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ i18n.ts
â”‚   â”œâ”€â”€ prisma.ts
â”‚   â”œâ”€â”€ auth.ts
â”‚   â”œâ”€â”€ dates.ts
â”‚   â””â”€â”€ api.ts
â”œâ”€â”€ locales/
â”‚   â”œâ”€â”€ en.json
â”‚   â”œâ”€â”€ mk.json
â”‚   â”œâ”€â”€ sq.json
â”‚   â”œâ”€â”€ tr.json
â”‚   â””â”€â”€ sr.json
â”œâ”€â”€ types/index.ts
â””â”€â”€ middleware.ts

prisma/
â”œâ”€â”€ schema.prisma
â””â”€â”€ migrations/
```

---

## STEP 3: ENVIRONMENT SETUP

Create `.env.local`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/vozenpark
NEXTAUTH_SECRET=your_secret_here_generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_your_resend_key
CRON_SECRET=your_cron_secret
```

---

## STEP 4: PRISMA SCHEMA

Create `prisma/schema.prisma` with this exact content. Use Cursor to generate this file.

---

## STEP 5: START WITH THESE COMMANDS

Run in your terminal:

```bash
# Create the project
npx create-next-app@latest vozenpark --typescript --tailwind --app

# Enter directory
cd vozenpark

# Install all dependencies
npm install next-i18next react-hook-form @hookform/resolvers zod resend zustand workbox-window date-fns bcryptjs @types/bcryptjs sonner lucide-react

# Now open Cursor IDE with this project
code .  # if you use VS Code
# or open Cursor and open the vozenpark folder
```

---

## STEP 6: USE CURSOR TO BUILD

Now copy this prompt into Cursor Agent and ask it to generate all the code:

### CURSOR PROMPT TO COPY:

```
I'm building VozenPark - a vehicle reminder PWA app with registration, insurance, and inspection reminders.

REQUIREMENTS:
- Framework: Next.js 14 with TypeScript, Tailwind CSS
- Auth: Email/password (bcryptjs)
- Database: Prisma + PostgreSQL
- Languages: English, Macedonian (default), Albanian, Turkish, Serbian
- Features: Multi-language support, responsive design, PWA, email reminders
- No browser storage (use server-side sessions)

TECH STACK:
- Frontend: React 18, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes, Prisma ORM
- Email: Resend
- Cron: Vercel Cron Functions

CREATE ALL THESE FILES:

1. Prisma Schema (prisma/schema.prisma):
   - User model: id, email, password (hashed), language
   - Vehicle model: id, userId, plate, regExpiry, insExpiry, inspExpiry
   - ReminderLog model: id, userId, vehicleId, reminderType, expiryType, sentAt

2. Auth Pages:
   - src/app/(auth)/login/page.tsx - Login form
   - src/app/(auth)/signup/page.tsx - Signup form
   - src/app/(auth)/layout.tsx - Auth layout

3. Auth API Routes:
   - src/app/api/auth/signup/route.ts - User registration
   - src/app/api/auth/login/route.ts - User login
   - src/app/api/auth/logout/route.ts - User logout

4. Vehicles API Routes:
   - src/app/api/vehicles/route.ts - GET (list), POST (create)
   - src/app/api/vehicles/[id]/route.ts - PUT (update), DELETE (delete)

5. Cron Job:
   - src/app/api/cron/send-reminders/route.ts - Daily email reminders

6. Dashboard Page:
   - src/app/dashboard/page.tsx - Main dashboard with vehicle list
   - Show status cards: ðŸ”´ URGENT, ðŸŸ¡ SOON, ðŸŸ¢ OK
   - Show vehicle table with plates and expiry dates
   - Click to edit/delete vehicles

7. Vehicle Forms:
   - src/app/vehicles/new/page.tsx - Add new vehicle form
   - src/app/vehicles/[id]/edit/page.tsx - Edit vehicle form

8. Components:
   - src/components/Header.tsx - App header with language selector
   - src/components/LanguageSelector.tsx - Language dropdown
   - src/components/StatusCard.tsx - Status card component
   - src/components/StatusBadge.tsx - Status badge (red/yellow/green)
   - src/components/LoadingSpinner.tsx - Loading spinner
   - src/components/ServiceWorkerRegistry.tsx - PWA service worker

9. Library Files:
   - src/lib/i18n.ts - Translation functions
   - src/lib/prisma.ts - Prisma client
   - src/lib/auth.ts - JWT auth functions
   - src/lib/dates.ts - Date utility functions
   - src/lib/api.ts - API call helpers

10. Type Definitions:
    - src/types/index.ts - TypeScript interfaces

11. Translations (5 languages):
    - src/locales/en.json - English
    - src/locales/mk.json - Macedonian (default)
    - src/locales/sq.json - Albanian
    - src/locales/tr.json - Turkish
    - src/locales/sr.json - Serbian

12. Landing Page:
    - src/app/page.tsx - Home page with Sign In / Sign Up buttons

13. Config Files:
    - next.config.ts
    - tailwind.config.ts
    - tsconfig.json
    - vercel.json (cron configuration)

REQUIREMENTS FOR EACH FILE:

Auth:
- Use JWT tokens stored in httpOnly cookies
- Password hashing with bcryptjs
- Redirect unauthenticated users to /login

Database:
- Prisma with PostgreSQL
- User-specific vehicle lists
- Unique plate per user

Vehicles:
- Users can only access their own vehicles
- CRUD operations
- Validate dates are in the future

Dashboard:
- Responsive design (mobile-first)
- Color-coded status badges
- Calculate days until expiry
- List view with edit/delete options

Email Reminders (Cron Job):
- Check all vehicles daily at 08:00 UTC
- Send emails 30 days before, 7 days before, 1 day before, on expiry
- Use Resend for email delivery
- Avoid duplicate reminders

Responsive Design:
- Mobile: < 640px - stacked layout
- Tablet: 640px - 1024px - 2-3 columns
- Desktop: > 1024px - full layout

Multi-Language:
- Default language: Macedonian (mk)
- Language selector in header
- Save language preference to localStorage
- All text in translations JSON files

PWA:
- manifest.json with app metadata
- Service worker for offline support
- Installable on mobile home screen

IMPORTANT:
- No browser storage (localStorage is fine for lang preference only)
- All data must go through API routes
- Validate all inputs
- Error handling on all pages
- Loading states on buttons
- Responsive design tested on mobile, tablet, desktop
- App name: VozenPark throughout
```

---

## AFTER CURSOR BUILDS THE CODE:

1. Run database migrations:
```bash
npx prisma migrate dev --name init
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000

4. Sign up and test adding a vehicle

5. Test all features work

---

## DEPLOYMENT TO VERCEL:

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect to Vercel:
- Go to vercel.com
- Connect your GitHub repo
- Add environment variables
- Deploy

---

## TRANSLATIONS - PASTE INTO EACH LOCALE FILE:

### English (en.json):
```json
{
  "common": {
    "appName": "VozenPark",
    "login": "Sign In",
    "signup": "Sign Up",
    "logout": "Sign Out",
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "addVehicle": "Add New Vehicle"
  },
  "vehicles": {
    "plate": "License Plate",
    "regExpiry": "Registration Expires",
    "insExpiry": "Insurance Expires",
    "inspExpiry": "Inspection Expires"
  },
  "status": {
    "expired": "Expired",
    "dueSoon": "Due Soon",
    "ok": "OK"
  }
}
```

### Macedonian (mk.json - DEFAULT):
```json
{
  "common": {
    "appName": "VozenPark",
    "login": "ÐŸÑ€Ð¸Ñ˜Ð°Ð²Ð°",
    "signup": "Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð°Ñ˜ ÑÐµ",
    "logout": "ÐžÐ´Ñ˜Ð°Ð²Ð°",
    "save": "Ð—Ð°Ñ‡ÑƒÐ²Ð°Ñ˜",
    "cancel": "ÐžÑ‚ÐºÐ°Ð¶Ð¸",
    "edit": "Ð£Ñ€ÐµÐ´Ð¸",
    "delete": "Ð˜Ð·Ð±Ñ€Ð¸ÑˆÐ¸",
    "addVehicle": "Ð”Ð¾Ð´Ð°Ñ˜ Ð½Ð¾Ð²Ð¾ Ð²Ð¾Ð·Ð¸Ð»Ð¾"
  },
  "vehicles": {
    "plate": "Ð ÐµÐ³Ð¸ÑÑ‚Ð°Ñ€ÑÐºÐ° Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð°",
    "regExpiry": "Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ˜Ð° Ð¸ÑÑ‚ÐµÐºÑƒÐ²Ð°",
    "insExpiry": "ÐžÑÐ¸Ð³ÑƒÑ€ÑƒÐ²Ð°ÑšÐµ Ð¸ÑÑ‚ÐµÐºÑƒÐ²Ð°",
    "inspExpiry": "ÐŸÑ€ÐµÐ³Ð»ÐµÐ´ Ð¸ÑÑ‚ÐµÐºÑƒÐ²Ð°"
  },
  "status": {
    "expired": "Ð˜ÑÑ‚ÐµÐºÐ»Ð¾",
    "dueSoon": "Ð£ÑÐºÐ¾Ñ€Ð¾",
    "ok": "Ð’Ð¾ Ñ€ÐµÐ´"
  }
}
```

### Albanian (sq.json):
```json
{
  "common": {
    "appName": "VozenPark",
    "login": "Hyj",
    "signup": "Regjistrohu",
    "logout": "Dilni",
    "save": "Ruaj",
    "cancel": "Anulo",
    "edit": "Redakto",
    "delete": "Fshi",
    "addVehicle": "Shto Automjet tÃ« Ri"
  },
  "vehicles": {
    "plate": "Tabela e Regjistrimit",
    "regExpiry": "Regjistrimi Skadon",
    "insExpiry": "Sigurimi Skadon",
    "inspExpiry": "Inspektimi Skadon"
  },
  "status": {
    "expired": "Skaduar",
    "dueSoon": "Skadon Shpejt",
    "ok": "OK"
  }
}
```

### Turkish (tr.json):
```json
{
  "common": {
    "appName": "VozenPark",
    "login": "Oturum AÃ§",
    "signup": "Kaydol",
    "logout": "Ã‡Ä±kÄ±ÅŸ Yap",
    "save": "Kaydet",
    "cancel": "Ä°ptal",
    "edit": "DÃ¼zenle",
    "delete": "Sil",
    "addVehicle": "Yeni AraÃ§ Ekle"
  },
  "vehicles": {
    "plate": "Plaka",
    "regExpiry": "KayÄ±t SÃ¼resi Doluyor",
    "insExpiry": "Sigorta SÃ¼resi Doluyor",
    "inspExpiry": "Muayene SÃ¼resi Doluyor"
  },
  "status": {
    "expired": "SÃ¼resi Doldu",
    "dueSoon": "YakÄ±nda Bitiyor",
    "ok": "Tamam"
  }
}
```

### Serbian (sr.json):
```json
{
  "common": {
    "appName": "VozenPark",
    "login": "ÐŸÑ€Ð¸Ñ˜Ð°Ð²Ð°",
    "signup": "Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€Ð°Ñ˜ ÑÐµ",
    "logout": "ÐžÐ´Ñ˜Ð°Ð²Ð°",
    "save": "Ð¡Ð°Ñ‡ÑƒÐ²Ð°Ñ˜",
    "cancel": "ÐžÑ‚ÐºÐ°Ð¶Ð¸",
    "edit": "Ð£Ñ€ÐµÐ´Ð¸",
    "delete": "ÐžÐ±Ñ€Ð¸ÑˆÐ¸",
    "addVehicle": "Ð”Ð¾Ð´Ð°Ñ˜ Ð½Ð¾Ð²Ð¾ Ð²Ð¾Ð·Ð¸Ð»Ð¾"
  },
  "vehicles": {
    "plate": "Ð ÐµÐ³Ð¸ÑÑ‚Ð°Ñ€ÑÐºÐ° Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð°",
    "regExpiry": "Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ˜Ð° Ð¸ÑÑ‚Ð¸Ñ‡Ðµ",
    "insExpiry": "ÐžÑÐ¸Ð³ÑƒÑ€Ð°ÑšÐµ Ð¸ÑÑ‚Ð¸Ñ‡Ðµ",
    "inspExpiry": "ÐŸÑ€ÐµÐ³Ð»ÐµÐ´ Ð¸ÑÑ‚Ð¸Ñ‡Ðµ"
  },
  "status": {
    "expired": "Ð˜ÑÑ‚ÐµÐºÐ»Ð¾",
    "dueSoon": "Ð’Ñ€Ð»Ð¾ Ð±Ñ€Ð·Ð¾",
    "ok": "Ð£ Ñ€ÐµÐ´Ñƒ"
  }
}
```

---

## QUICK REFERENCE - MAIN FEATURES:

âœ… User signup/login with email and password
âœ… Dashboard showing all vehicles
âœ… Color-coded status: ðŸ”´ Urgent (â‰¤0 days), ðŸŸ¡ Soon (1-7 days), ðŸŸ¢ OK (>7 days)
âœ… Add/edit/delete vehicles
âœ… Email reminders: 30d, 7d, 1d, and on expiry
âœ… 5 language support with language selector
âœ… PWA installable on mobile
âœ… Responsive design (mobile, tablet, desktop)
âœ… Daily cron job for sending reminders

---

## TESTING CHECKLIST:

- [ ] Signup creates new user
- [ ] Login works with correct credentials
- [ ] Dashboard loads vehicles
- [ ] Can add new vehicle
- [ ] Can edit vehicle
- [ ] Can delete vehicle
- [ ] Status badges show correct colors
- [ ] Language selector works
- [ ] App is responsive on mobile
- [ ] Can install as PWA
- [ ] Email reminders send (check Resend dashboard)

---

**Ready to build? Start with the STEP 1 commands, then paste the CURSOR PROMPT into Cursor IDE!** ðŸš€