import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { properties as localProperties } from '../src/data.js';
import { propertyPath } from '../src/format.js';
import { propertySeoDescription, propertySeoTitle, propertyStructuredData } from '../src/seo.js';

const fileEnv = loadEnv('production', process.cwd(), '');
const getEnv = (name) => process.env[name]?.trim() || fileEnv[name]?.trim();
const DEFAULT_SITE_URL = 'https://asetrumahbatam.com';
const siteUrl = (getEnv('SITE_URL') || getEnv('VITE_SITE_URL') || DEFAULT_SITE_URL)
  .trim()
  .replace(/\/+$/, '');
const parsedSiteUrl = new URL(siteUrl);

if (!['http:', 'https:'].includes(parsedSiteUrl.protocol)) {
  throw new Error('SITE_URL harus menggunakan protokol http atau https.');
}

const localData = () => localProperties;

const loadProperties = async () => {
  const supabaseUrl = getEnv('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

  if (Boolean(supabaseUrl) !== Boolean(supabaseAnonKey)) {
    throw new Error('VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus diisi berpasangan.');
  }

  if (!supabaseUrl) {
    console.info('Supabase build env tidak tersedia; memakai data lokal untuk sitemap.');
    return localData();
  }

  const endpoint = new URL('/rest/v1/properties', supabaseUrl);
  endpoint.searchParams.set('select', 'id,title,location,description,image,gallery,price,beds,baths,sqft');
  endpoint.searchParams.set('order', 'id.asc');

  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil properti dari Supabase untuk SEO (HTTP ${response.status}).`);
  }

  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error('Respons properti Supabase untuk SEO bukan berupa daftar.');
  }
  if (!rows.length) {
    console.warn('Supabase tidak memiliki listing; memakai data lokal untuk sitemap.');
    return localData();
  }

  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
    price: Number(row.price),
    beds: Number(row.beds),
    baths: Number(row.baths),
    sqft: Number(row.sqft),
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
  }));
};

const escapeXml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const upsertMeta = (html, attribute, key, content) => {
  const expression = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}="${escapeRegExp(key)}")[^>]*\\/?>`,
    'i',
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return expression.test(html)
    ? html.replace(expression, tag)
    : html.replace('</head>', `    ${tag}\n  </head>`);
};

const escapeJsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const updateHomeHtml = (template) => {
  const homeUrl = `${siteUrl}/`;
  const imageUrl = new URL('/og-image.svg', siteUrl).href;
  let html = template.replaceAll(DEFAULT_SITE_URL, siteUrl);
  html = upsertMeta(html, 'property', 'og:url', homeUrl);
  html = upsertMeta(html, 'property', 'og:image', imageUrl);
  html = upsertMeta(html, 'name', 'twitter:image', imageUrl);
  html = html.replace(
    /<link\b(?=[^>]*\brel="canonical")[^>]*\/?>/i,
    () => `<link rel="canonical" href="${escapeHtml(homeUrl)}" />`,
  );
  return html;
};

const createPropertyHtml = (template, property, properties) => {
  const propertyUrl = new URL(propertyPath(property), siteUrl).href;
  const image = property.image || property.gallery?.[0] || '/og-image.svg';
  const seoTitle = propertySeoTitle(property, properties);
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    () => `<title>${escapeHtml(seoTitle)}</title>`,
  );
  html = upsertMeta(html, 'name', 'description', propertySeoDescription(property));
  html = upsertMeta(html, 'property', 'og:title', seoTitle);
  html = upsertMeta(html, 'property', 'og:description', propertySeoDescription(property));
  html = upsertMeta(html, 'property', 'og:type', 'article');
  html = upsertMeta(html, 'property', 'og:url', propertyUrl);
  html = upsertMeta(html, 'property', 'og:image', new URL(image, siteUrl).href);
  html = upsertMeta(html, 'name', 'twitter:title', seoTitle);
  html = upsertMeta(html, 'name', 'twitter:description', propertySeoDescription(property));
  html = upsertMeta(html, 'name', 'twitter:image', new URL(image, siteUrl).href);
  html = html.replace(
    /<link\b(?=[^>]*\brel="canonical")[^>]*\/?>/i,
    () => `<link rel="canonical" href="${escapeHtml(propertyUrl)}" />`,
  );

  const schemaScript = `<script type="application/ld+json" ${'data-property-schema'}>${escapeJsonLd(
    propertyStructuredData(property, siteUrl),
  )}</script>`;
  return html.replace('</head>', `    ${schemaScript}\n  </head>`);
};

const generate = async () => {
  const properties = await loadProperties();
  const uniqueProperties = [...new Map(properties.map((property) => [property.id, property])).values()];
  const paths = ['/', ...uniqueProperties.map(propertyPath)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((path) => `  <url><loc>${escapeXml(new URL(path, siteUrl).href)}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  const publicDir = join(process.cwd(), 'public');
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

  const robotsPath = join(publicDir, 'robots.txt');
  const robotsText = existsSync(robotsPath)
    ? readFileSync(robotsPath, 'utf8')
    : 'User-agent: *\nAllow: /\n';
  const updatedRobots = /^Sitemap:.*$/mi.test(robotsText)
    ? robotsText.replace(/^Sitemap:.*$/mi, `Sitemap: ${siteUrl}/sitemap.xml`)
    : `${robotsText.trimEnd()}\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  writeFileSync(robotsPath, updatedRobots, 'utf8');

  const distDir = join(process.cwd(), 'dist');
  if (existsSync(join(distDir, 'index.html'))) {
    writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf8');
    const template = updateHomeHtml(readFileSync(join(distDir, 'index.html'), 'utf8'));
    writeFileSync(join(distDir, 'index.html'), template, 'utf8');
    writeFileSync(join(distDir, 'robots.txt'), updatedRobots, 'utf8');

    uniqueProperties.forEach((property) => {
      const outputDir = join(distDir, propertyPath(property).slice(1));
      mkdirSync(outputDir, { recursive: true });
      writeFileSync(
        join(outputDir, 'index.html'),
        createPropertyHtml(template, property, uniqueProperties),
        'utf8',
      );
    });
  }

  console.info(`Generated sitemap and SEO HTML for ${uniqueProperties.length} properties.`);
};

generate().catch((error) => {
  console.error(`SEO artifact generation failed: ${error.message}`);
  process.exitCode = 1;
});
