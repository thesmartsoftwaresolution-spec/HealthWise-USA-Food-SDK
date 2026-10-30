# Supabase setup for HealthWise USA

1. Set Cloudflare Pages build output to `dist`, build command to `npm run build`, and install command to `npm install`. The stale Bun lockfile has been removed because the Supabase dependency was added; run `npm install` in a network-enabled development environment and commit the generated `package-lock.json` before relying on reproducible production builds.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to Cloudflare Pages environment variables for Production and Preview.
3. Apply `migrations/20261030000000_initial_schema.sql` to the Supabase project after it is active. Review the SQL before production use.
4. Seed the existing demo content from the repo using a trusted local environment: set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in a local `.env`, then run `npm run seed:supabase`. The secret key is server-only; never use it in a `VITE_*` variable or commit it.
5. In Supabase API settings, make sure the `public` schema is exposed to the Data API. Current Supabase projects may require explicitly enabling schema exposure; SQL grants and RLS policies are also provided in the migration.
6. Configure Auth > URL Configuration with the deployed Cloudflare Pages URL and local development URL as allowed redirect URLs.
7. Create the first administrator through Supabase Auth, then promote that user's profile using the SQL editor:
   `update public.profiles set role = 'admin' where email = 'YOUR-ADMIN-EMAIL';`
   Never expose an admin role switcher or put a service role/secret key in browser code.
8. Set up AI and remaining API functionality as Supabase Edge Functions, with provider keys stored as Edge Function secrets. The old Express server uses in-memory data and will not run merely by deploying the Vite `dist` folder.
