# Supabase setup for HealthWise USA

## Completed in the connected project
- Initial schema and RLS policies are applied.
- 13 categories, 20 articles, 10 recipes, and site settings are seeded.
- Supabase Edge Function `api` is deployed and active.
- Browser-safe project URL and publishable key are configured as defaults in `src/lib/supabase.ts`; Cloudflare variables may override them.

## Before production launch
1. Set Cloudflare Pages build output to `dist`, build command to `npm run build`, and install command to `npm install`. The stale Bun lockfile was removed after adding the Supabase dependency. Generate and commit `package-lock.json` from a network-enabled development environment before relying on reproducible production builds.
2. Configure Supabase Auth > URL Configuration with your deployed Cloudflare Pages URL and local development URL as allowed redirect URLs.
3. Add `GEMINI_API_KEY` as a Supabase Edge Function secret to enable AI tools. Do not paste the key into browser code or commit it to GitHub.
4. Register your own account through the website. Then promote that account to admin using the Supabase SQL editor:
   `update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL';`
   The profile role trigger and RLS policies prevent regular users from promoting themselves.
5. The initial schema is in `migrations/20261030000000_initial_schema.sql`; follow-up security and policy changes are in the later migration files. They have already been applied to the connected Supabase project. Re-apply them only when setting up a new project.
6. The content seeding script is available as `npm run seed:supabase`. It requires `SUPABASE_URL` and a server-only `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in a trusted local environment. Never use a secret/service-role key in a `VITE_*` variable.
7. Confirm the `public` schema is exposed to the Supabase Data API if the deployed Edge Function reports table/schema access errors. The migration includes explicit grants and RLS policies.
