import { useEffect } from 'react';
import { propertyPath } from '../format';

const SEO_MARKER = 'data-property-seo';

export const usePropertySeo = (property) => {
  useEffect(() => {
    if (!property) return undefined;

    const originalTitle = document.title;
    let descriptionMeta = document.querySelector(`meta[name="description"][${SEO_MARKER}]`);
    let canonical = document.querySelector(`link[rel="canonical"][${SEO_MARKER}]`);

    const createdElements = [];

    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      descriptionMeta.setAttribute(SEO_MARKER, 'true');
      document.head.appendChild(descriptionMeta);
      createdElements.push(descriptionMeta);
    }

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.setAttribute(SEO_MARKER, 'true');
      document.head.appendChild(canonical);
      createdElements.push(canonical);
    }

    document.title = `${property.title} di ${property.location} | Aset Rumah Batam`;
    descriptionMeta.content = property.description;
    canonical.href = new URL(propertyPath(property), window.location.origin).href;

    return () => {
      document.title = originalTitle;
      createdElements.forEach((el) => el.remove());
    };
  }, [property]);
};
