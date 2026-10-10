create table if not exists public.properties (
  id bigint primary key,
  type integer not null,
  house_type text not null default 'Rumah',
  title text not null,
  price bigint not null,
  location text not null,
  beds integer not null default 0,
  baths integer not null default 0,
  sqft numeric not null default 0,
  image text not null,
  gallery text[] not null default '{}',
  tag text not null,
  description text not null default '',
  agent text not null default ''
);

alter table public.properties enable row level security;
grant select on public.properties to anon, authenticated;

drop policy if exists "Anyone can read properties" on public.properties;
create policy "Anyone can read properties"
  on public.properties
  for select
  to anon, authenticated
  using (true);

insert into public.properties
  (id, type, house_type, title, price, location, beds, baths, sqft, image, gallery, tag, description, agent)
values
  (1, 36, 'Rumah', 'Perumahan Amalfi', 300000000, 'Tembesi', 0, 2, 120,
   '/asset/img/house-1.svg', ARRAY['/asset/img/house-1.svg', '/asset/img/house-2.svg', '/asset/img/house-3.svg', '/asset/img/house-4.svg'],
   'Rumah 1 Lantai', 'Rumah dengan akses mudah ke pusat kota dan fasilitas umum, cocok untuk hunian keluarga yang mengutamakan kenyamanan dan lokasi strategis.', 'Frans Hutapea'),
  (2, 45, 'Rumah 2Lt', 'Rumah Mewah Nagoya Hill', 2100000000, 'Nagoya', 4, 3, 200,
   '/asset/img/house-2.svg', ARRAY['/asset/img/house-2.svg', '/asset/img/house-4.svg', '/asset/img/house-5.svg', '/asset/img/house-6.svg'],
   'Rumah Mewah', 'Properti mewah dengan konsep modern, ruang luas, dan tata letak nyaman untuk kebutuhan keluarga besar maupun investasi jangka panjang.', 'Frans Hutapea'),
  (3, 36, 'Rumah', 'Cluster Minimalis Batu Aji', 650000000, 'Batu Aji, Batam', 2, 1, 72,
   '/asset/img/house-3.svg', ARRAY['/asset/img/house-3.svg', '/asset/img/house-1.svg', '/asset/img/house-5.svg', '/asset/img/house-6.svg'],
   'Residensial', 'Cluster minimalis yang nyaman dengan desain modern, cocok untuk keluarga muda yang mencari hunian terjangkau di lokasi strategis.', 'Frans Hutapea'),
  (4, 36, 'Rumah', 'Cluster Minimalis Batu Aji', 650000000, 'Marina, Batam', 2, 1, 72,
   '/asset/img/house-4.svg', ARRAY['/asset/img/house-4.svg', '/asset/img/house-2.svg', '/asset/img/house-3.svg', '/asset/img/house-1.svg'],
   'Residensial', 'Hunian dengan tata ruang efisien, pencahayaan alami, dan lingkungan yang tenang untuk kebutuhan tinggal sehari-hari.', 'Frans Hutapea'),
  (5, 36, 'Rumah', 'Cluster Minimalis Batu Aji', 650000000, 'Batu Aji, Batam', 2, 1, 72,
   '/asset/img/house-5.svg', ARRAY['/asset/img/house-5.svg', '/asset/img/house-6.svg', '/asset/img/house-2.svg', '/asset/img/house-4.svg'],
   'Residensial', 'Kawasan yang tak jauh dari akses utama, dengan desain rumah simpel namun tetap nyaman dan fungsional untuk keluarga.', 'Frans Hutapea'),
  (6, 36, 'Rumah', 'Cluster Minimalis Batu Aji', 650000000, 'Batu Aji, Batam', 2, 1, 72,
   '/asset/img/house-6.svg', ARRAY['/asset/img/house-6.svg', '/asset/img/house-1.svg', '/asset/img/house-3.svg', '/asset/img/house-5.svg'],
   'Residensial', 'Rumah siap huni dengan area yang bersih, sirkulasi nyaman, dan lokasi yang cocok untuk aktivitas harian maupun investasi.', 'Frans Hutapea'),
  (7, 36, 'Rumah', 'Cluster Minimalis Batu Aji', 650000000, 'Batu Aji, Batam', 2, 1, 72,
   '/asset/img/house-3.svg', ARRAY['/asset/img/house-3.svg', '/asset/img/house-4.svg', '/asset/img/house-6.svg', '/asset/img/house-2.svg'],
   'Residensial', 'Pilihan rumah yang nyaman untuk tinggal atau disewakan, dengan nilai strategis di area berkembang dan akses yang mudah dijangkau.', 'Frans Hutapea')
on conflict (id) do nothing;