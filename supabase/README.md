# Supabase setup — Ishta

The mobile app talks to **Supabase** directly (`@supabase/supabase-js`) for
registration and login. Supabase Auth handles email/password securely (hashed
passwords, sessions); a `profiles` table stores name + preferred language.

> Architecture note: this is the current data layer for the **Ishta** app.
> The NestJS API (`apps/api`) can be reintroduced in front of the same Supabase
> Postgres later for payments and live-room token gating (see ARCHITECTURE §).

## One-time setup

### 1. Create the project
1. Go to <https://supabase.com> → **New project**.
2. Pick a name (e.g. `ishta`), a strong DB password, and the region
   **closest to India** (e.g. `ap-south-1` Mumbai / Singapore) for latency
   and data-residency.
3. Wait for it to provision (~2 min).

### 2. Apply the schema
1. In the dashboard: **SQL Editor → New query**.
2. Paste the contents of [`schema.sql`](schema.sql) → **Run**.
   This creates `profiles`, RLS policies, and the signup trigger.

### 3. Turn OFF email confirmation (for the demo)
So signup logs the user straight in (no confirmation email step):
- **Authentication → Providers → Email** → disable **"Confirm email"** → Save.
  (Re-enable before a real launch.)

### 4. Get the client keys
- **Project Settings → API**:
  - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
  - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- These are **public** by design; Row-Level Security protects the data.
  (Never put the **service_role** key in the app.)

### 5. Configure the app
```bash
cp apps/mobile/.env.example apps/mobile/.env
# edit apps/mobile/.env and paste your URL + anon key
```
Restart the Expo dev server after editing `.env`.

## Deity images (Ishta Daiva)

The deity catalog + images are managed entirely from the Supabase dashboard — **no custom admin page**.

1. **Create the table + seed:** SQL Editor → run [`deities.sql`](deities.sql).
2. **Create a Storage bucket:** Storage → **New bucket** → name **`deities`** → tick **Public bucket** → Create.
3. **Upload images:** open the `deities` bucket → **Upload** files named to match each row's `image_path`
   (e.g. `venkateswara.png`, `shiva.png`, …). Use properly-licensed images.
4. **(Add a new deity later):** Table Editor → `deities` → **Insert row** (`key`, `display_name`, `image_path`),
   then upload the matching image to the bucket. The app's picker and Home card update automatically — no release.

The app reads the catalog for the Ishta Daiva picker and shows the chosen deity's image on Home
(falls back to a 🕉️ icon until an image is uploaded).

### Manage it without the dashboard — the local Admin app
For a friendlier workflow, use the **local admin web app** ([`admin/`](../admin/README.md)): an
operator signs in and adds/edits deities + uploads images through a simple UI. It uses the
public anon key + admin session (RLS restricts writes to admins). Run `supabase/admin.sql`
to enable it.

## Verify
- Register in the app → a row appears in **Authentication → Users** and in
  **Table editor → profiles**.
- Sign out and sign back in with the same email/password.
- Kill and reopen the app → you stay signed in (session persisted) and land on Home.

## Notes
- If `EXPO_PUBLIC_SUPABASE_*` are missing, the app logs a warning and still lets
  you click through (demo mode) without saving anything.
- Data is protected by **RLS** — each user can read/write only their own profile.
