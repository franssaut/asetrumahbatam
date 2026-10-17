# Aset Rumah Batam

## Supabase setup

1. Open the Supabase project SQL Editor and run `supabase/schema.sql`. This creates the `properties` table and its read-only policy.
2. Run `npm run generate:seed` whenever `src/data.js` changes. This regenerates `supabase/seed.sql` with an upsert for every property. Run the generated SQL in the Supabase SQL Editor to apply the data changes.
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project API settings. Use the anon/publishable key, never a service-role key in the browser.
4. Restart the Vite server. The home listing and property detail pages will load from Supabase. If configuration or the database is unavailable, the app shows local demo data and a status notice.

The table uses `house_type` in SQL; the app maps it to `houseType` for the existing UI.

## SEO build output

`npm run build` generates `public/sitemap.xml` and static HTML metadata for each property route in `dist/`. Set `SITE_URL` to the canonical production origin if it differs from `https://asetrumahbatam.com`. When both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are available to the build, the sitemap and property metadata are generated from the public `properties` table; otherwise, local data is used.