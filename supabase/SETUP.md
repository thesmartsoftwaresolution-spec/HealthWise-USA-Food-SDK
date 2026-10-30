# Supabase setup for HealthWise USA

## Connected project status
- Supabase project is active: `elsfyrfwlwssidgvwruc`.
- Initial schema and RLS policies are applied.
- 13 categories, 20 articles, 10 recipes, and site settings are seeded.
- Supabase Edge Function `api` is deployed and active.
- Supabase Security Advisor currently reports no security lint findings.
- Browser-safe project URL and publishable key are configured as defaults in `src/lib/supabase.ts`; Cloudflare variables may override them.

## Cloudflare Pages environment variables

In Cloudflare Dashboard, open **Workers & Pages → your Pages project → Settings → Environment variables**. Add these variables for **Production** and **Preview** (if you use preview deployments):

| Variable | Value | Required? |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://elsfyrfwlwssidgvwruc.supabase.co` | Recommended |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase project's publishable key (`sb_publishable_...`) | Recommended |

The code currently has these same browser-safe defaults, so the site can use them without Cloudflare variables. Setting them in Cloudflare makes deployment configuration explicit and lets you change projects without editing source code. After adding/changing variables, trigger a new deployment because Vite embeds `VITE_*` variables at build time.

**Never add** `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, database passwords, or other server secrets as `VITE_*` variables or browser-visible variables. Do not expose secret/service-role keys in Cloudflare Pages build variables for this frontend.

## Supabase Edge Function secret

The AI endpoints need this secret in Supabase, not in Cloudflare Pages:

- `GEMINI_API_KEY` — your Google Gemini API key. In Supabase Dashboard, open **Edge Functions → Secrets** and add it there. Do not commit it to GitHub or put it in frontend code.

The Edge Function uses Supabase's runtime environment variables for its project URL and public/anon key. Those are provided by the Supabase function runtime; do not manually add a service-role key for this API function.

## Before production launch
1. Set Cloudflare Pages build command to `npm run build` and build output directory to `dist`; use `npm install` as the install command if the dashboard asks for one. Generate and commit `package-lock.json` from a network-enabled development environment before relying on reproducible production builds.
2. Configure Supabase **Authentication → URL Configuration** with your deployed Cloudflare Pages URL and local development URL as allowed redirect URLs.
3. Add `GEMINI_API_KEY` as a Supabase Edge Function secret to enable AI tools.
4. Register your own account through the website. Then promote that account to admin using the Supabase SQL editor:
   `update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL';`
   The profile role trigger and RLS policies prevent regular users from promoting themselves.
5. The initial schema is in `migrations/20261030000000_initial_schema.sql`; follow-up security and policy changes are in the later migration files. They have already been applied to the connected Supabase project. Re-apply them only when setting up a new project.
6. The content seeding script is available as `npm run seed:supabase`. It requires `SUPABASE_URL` and a server-only `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in a trusted local environment. These are only for running the seed script, not for Cloudflare's browser-facing build.
7. Confirm the `public` schema is exposed to the Supabase Data API if the deployed Edge Function reports table/schema access errors. The migration includes explicit grants and RLS policies.
