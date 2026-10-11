# Aset Rumah Batam

## Supabase setup

1. Open the Supabase project SQL Editor and run `supabase/schema.sql`. This creates the `properties` table and its read-only policy.
2. Run `npm run generate:seed` whenever `src/data.js` changes. This regenerates `supabase/seed.sql` with an upsert for every property. Run the generated SQL in the Supabase SQL Editor to apply the data changes.
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project API settings. Use the anon/publishable key, never a service-role key in the browser.
4. Restart the Vite server. The home listing and property detail pages will load from Supabase. If configuration or the database is unavailable, the app shows local demo data and a status notice.

The table uses `house_type` in SQL; the app maps it to `houseType` for the existing UI.