# Ishta Admin (local)

A self-contained admin web app to manage the **deities catalog + images** in Supabase.
It runs on your machine, signs in as an **admin** user, and writes directly to Supabase
(public anon key + your session). Row-Level Security restricts writes to admins only —
**no `service_role` key is ever used in the browser.**

## One-time setup

1. **Apply the SQL** (Supabase → SQL Editor), in order if not already done:
   - `supabase/schema.sql` (profiles)
   - `supabase/deities.sql` (deities table + seed)
   - `supabase/admin.sql` (admins table + write policies)
2. **Create the Storage bucket** `deities` (Storage → New bucket → **Public**).
3. **Create your admin login:** sign up once (in the mobile app or via the admin page's
   sign-in after you create the user in Supabase → Authentication → Users → Add user),
   then make yourself an admin (SQL Editor):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

## Run it locally
From the repo root:
```bash
npx serve .
```
Then open **http://localhost:3000/admin/** (or whatever port `serve` prints).

> Tip: any static server works (`python -m http.server`, VS Code Live Server, etc.).
> Open via `http://…/admin/`, not the `file://` path, so auth/storage work reliably.

## Use it
1. First load → **Settings**: paste your Supabase **Project URL** + **anon public** key
   (Project Settings → API). Saved in this browser only.
2. **Sign in** with your admin email/password.
3. **Deities manager:**
   - **Add deity:** key (slug), display name, sort order, and an image file → **Save**.
     The image uploads to the `deities` bucket; the row stores its `image_path`.
   - **Edit / Delete** existing rows.
4. The mobile app reads this catalog live — new/updated deities and images appear in the
   Ishta Daiva picker and on Home (no app release needed).

## Why this is safe
- Browser holds only the **public anon key**.
- `admins` table + RLS policies (`supabase/admin.sql`) allow **insert/update/delete only for admins**, on both the `deities` table and the `deities` Storage bucket.
- Everyone else (including the mobile app) gets **read-only** access to the catalog.
