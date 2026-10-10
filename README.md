# Aset Rumah Batam

## Supabase setup

1. Open the Supabase project SQL Editor and run `supabase/schema.sql`. This creates the read-only `properties` table policy and upserts every demo property field, including its main image path and complete gallery link array. Rerunning the script updates existing records too.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project API settings. Use the anon/publishable key, never a service-role key in the browser.
3. Restart the Vite server. The home listing and property detail pages will load from Supabase. If configuration or the database is unavailable, the app shows local demo data and a status notice.

The table uses `house_type` in SQL; the app maps it to `houseType` for the existing UI.