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

## Verify
- Register in the app → a row appears in **Authentication → Users** and in
  **Table editor → profiles**.
- Sign out and sign back in with the same email/password.
- Kill and reopen the app → you stay signed in (session persisted) and land on Home.

## Notes
- If `EXPO_PUBLIC_SUPABASE_*` are missing, the app logs a warning and still lets
  you click through (demo mode) without saving anything.
- Data is protected by **RLS** — each user can read/write only their own profile.
