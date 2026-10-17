import { formatRupiah, propertyPath } from './format.js';

const absoluteUrl = (value, siteUrl) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : new URL(value, siteUrl).href;
};

const propertyLocation = (property) => {
  const location = property.location?.trim() || 'Batam';
  return /batam/i.test(location) ? location : `${location}, Batam`;
};

const seoTitleQualifier = (property) => {
  const description = property.description || '';
  if (/keluarga muda/i.test(description)) return 'family';
  if (/akses utama/i.test(description)) return 'access';
  if (/siap huni/i.test(description)) return 'ready';
  if (/disewakan/i.test(description)) return 'rent';
  if (/investasi/i.test(description)) return 'investment';
  return '';
};

export const propertySeoTitle = (property, allProperties = [property]) => {
  const sameListingGroup = allProperties.filter((candidate) => (
    candidate.id !== property.id
    && candidate.title?.trim().toLowerCase() === property.title?.trim().toLowerCase()
    && candidate.location?.trim().toLowerCase() === property.location?.trim().toLowerCase()
  ));

  if (!sameListingGroup.length) {
    return `Jual ${property.title} di ${propertyLocation(property)} | Aset Rumah Batam`;
  }

  const qualifier = seoTitleQualifier(property);
  const qualifierIsUnique = qualifier && !sameListingGroup.some(
    (candidate) => seoTitleQualifier(candidate) === qualifier,
  );
  if (qualifierIsUnique) {
    const area = (property.location || 'Batam').replace(/,\s*batam$/i, '');
    const listingTitles = {
      family: `Jual Cluster Minimalis ${area} untuk Keluarga Muda`,
      access: `Jual Cluster Minimalis ${area} dekat Akses Utama`,
      ready: `Jual Rumah Siap Huni di ${area}`,
      rent: `Jual Rumah ${area} untuk Disewakan`,
      investment: `Jual Rumah ${area} untuk Investasi`,
    };
    if (listingTitles[qualifier]) {
      return `${listingTitles[qualifier]} | Aset Rumah Batam`;
    }
  }

  return `Jual ${property.title} Unit ${property.id} | Aset Rumah Batam`;
};

export const propertySeoDescription = (property) => {
  const title = property.title?.replace(/\s+/g, ' ').trim() || 'Properti';
  const location = propertyLocation(property).replace(/\s+/g, ' ').trim();
  const description = property.description?.replace(/\s+/g, ' ').trim();
  const price = Number(property.price);
  const priceText = Number.isFinite(price) && price > 0
    ? ` Harga ${formatRupiah(price)}.`
    : '';
  const text = `Jual ${title} di ${location}.${priceText}${description ? ` ${description}` : ''}`;
  const characters = Array.from(text);

  return characters.length > 160 ? `${characters.slice(0, 157).join('').trimEnd()}...` : text;
};

export const propertyStructuredData = (property, siteUrl) => {
  const propertyUrl = new URL(propertyPath(property), siteUrl).href;
  const imageUrl = absoluteUrl(
    property.image || property.gallery?.[0] || '/og-image.svg',
    siteUrl,
  );
  const images = Array.isArray(property.gallery) && property.gallery.length
    ? property.gallery.map((image) => absoluteUrl(image, siteUrl)).filter(Boolean)
    : [imageUrl];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SingleFamilyResidence',
        '@id': `${propertyUrl}#property`,
        name: property.title,
        description: propertySeoDescription(property),
        image: images,
        url: propertyUrl,
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.location,
          addressRegion: 'Kepulauan Riau',
          addressCountry: 'ID',
        },
        numberOfBedrooms: Number(property.beds ?? 0),
        numberOfBathroomsTotal: Number(property.baths ?? 0),
        floorSize: {
          '@type': 'QuantitativeValue',
          value: Number(property.sqft ?? 0),
          unitCode: 'MTK',
        },
        offers: {
          '@type': 'Offer',
          price: Number(property.price ?? 0),
          priceCurrency: 'IDR',
          url: propertyUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Beranda',
            item: new URL('/', siteUrl).href,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: property.title,
            item: propertyUrl,
          },
        ],
      },
    ],
  };
};
