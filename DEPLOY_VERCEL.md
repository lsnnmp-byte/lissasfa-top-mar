Vercel deployment guide for lissasfa-top

1) Quick deploy (recommended)

- Go to https://vercel.com and sign in with GitHub.
- Click "Import Project" → choose this repository `ywet290-dev/lissasfa-top`.
- Set the Project Name to `lissasfa-top` (this will give a default URL like `https://lissasfa-top.vercel.app`).
- Leave build & output settings to auto-detect (Next.js). Deploy.

2) Custom domain (optional)

- In the Vercel project dashboard, open Settings → Domains.
- Add your domain (for example: `lissasfa-top.example.com` or `lissasfa-top.com`).
- Follow the DNS instructions Vercel shows (add `A` / `CNAME` / `ALIAS` as required).

3) Automated deploys from GitHub

- With GitHub integration enabled (the `vercel.json` file is included), Vercel will automatically build on pushes to `main`.

4) Notes about this repository

- This app uses Next.js API routes (`/api/*`). Vercel supports these serverless functions; deploying to Vercel preserves full dynamic behavior.
- If you prefer GitHub Pages (static-only), use the `out/` export that the existing GitHub Actions workflow already produces. That route will not support API routes.

5) Optional: CI deploy via GitHub Actions

- If you want automatic deploys from GitHub Actions (instead of Vercel's integration), I can add a workflow that uses a Vercel token. You'll need to add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub secrets.
