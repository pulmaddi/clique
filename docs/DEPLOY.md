# Deploying the preview to Render

This deploys the **client preview portal** (wireframes + requirements docs) as a free **static site** on Render, giving you a shareable `https://…onrender.com` link.

Render deploys from a Git repository, so the flow is: **push to GitHub → connect on Render**.

---

## What gets deployed
- `index.html` — public **hero / landing page** (logo, goal, Register Now, Terms)
- `terms.html` — Terms & Conditions (draft; payment terms added later)
- `preview.html` — client review portal (links wireframes + all docs)
- `view.html` — in-browser viewer that renders the `.md` docs nicely
- `docs/` — requirements, architecture, roadmap, branding, glossary
- `docs/wireframes/index.html` — the screen mockups
- `render.yaml` — Render blueprint (static site, no build step)

> The Render root URL now shows the **landing page**; the review portal is at `/preview.html`.

No build, no server, no secrets — it's all static files.

---

## One-time setup

### 1. Put the project on GitHub
The repo is already initialized with a first commit. Just create an **empty** repo on github.com (e.g. `clique-preview`, no README), then:
```bash
cd c:/projects/clique
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Deploy on Render (pick ONE option)

**Option A — Blueprint (uses `render.yaml`, recommended):**
1. Go to <https://dashboard.render.com> → **New** → **Blueprint**.
2. Connect your GitHub account and pick this repo.
3. Render reads `render.yaml`, shows the `ishta-preview` static site → **Apply**.

**Option B — Manual static site:**
1. **New** → **Static Site** → connect the repo.
2. Settings: **Build Command** = *(leave empty)*, **Publish Directory** = `.`
3. **Create Static Site**.

In ~1 minute you get a URL like `https://ishta-preview.onrender.com`. Share that with the client.

---

## Updating later
Every `git push` to `main` auto-redeploys. Edit a doc or wireframe → commit → push → the live link updates.

---

## Privacy note (important)
A Render static site is **publicly reachable by anyone with the URL** (we add `noindex` so search engines skip it, but it is not password-protected on the free tier). This preview contains business requirements — treat the URL as semi-private.

If the client needs access control, options:
- Render **paid** plans support password protection / access rules.
- Or host behind a service that supports basic auth (e.g. Netlify/Cloudflare Access).
- Or keep sharing the URL privately and rotate it (rename the service) if it leaks.

---

## Alternatives to Render (if easier)
- **Netlify Drop** (<https://app.netlify.com/drop>) — drag the `clique` folder into the browser, instant URL, no Git needed. Fastest for a quick share.
- **GitHub Pages**, **Cloudflare Pages**, **Vercel** — all host this static folder for free.

> The app itself (React Native + NestJS) will deploy differently later — this guide is only for the static **preview/requirements** site.
