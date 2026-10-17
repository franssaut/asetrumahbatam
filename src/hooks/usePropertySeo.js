import { useEffect } from 'react';
import { propertyPath } from '../format';
import { propertySeoDescription, propertySeoTitle, propertyStructuredData } from '../seo';

const SEO_MARKER = 'data-property-seo';
const JSON_LD_MARKER = 'data-property-schema';

export const usePropertySeo = (property, allProperties) => {
  useEffect(() => {
    if (!property) return undefined;

    const originalTitle = document.title;
    const propertyUrl = new URL(propertyPath(property), window.location.origin).href;
    const imageUrl = new URL(
      property.image || property.gallery?.[0] || '/og-image.svg',
      window.location.origin,
    ).href;
    const seoDescription = propertySeoDescription(property);
    const seoTitle = propertySeoTitle(property, allProperties);
    const updatedTags = [];

    document.title = seoTitle;

    const ensureMeta = (attribute, key, content) => {
      const selector = `${attribute === 'name' ? 'meta[name="' : 'meta[property="'}${key}"]`;
      let tag = document.querySelector(selector);
      const created = !tag;

      if (created) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }

      updatedTags.push({ tag, created, originalContent: tag.getAttribute('content') });
      tag.setAttribute(SEO_MARKER, 'true');
      tag.content = content;
    };

    ensureMeta('name', 'description', seoDescription);
    ensureMeta('property', 'og:title', seoTitle);
    ensureMeta('property', 'og:description', seoDescription);
    ensureMeta('property', 'og:url', propertyUrl);
    ensureMeta('property', 'og:type', 'article');
    ensureMeta('property', 'og:image', imageUrl);
    ensureMeta('name', 'twitter:title', seoTitle);
    ensureMeta('name', 'twitter:description', seoDescription);
    ensureMeta('name', 'twitter:image', imageUrl);
    ensureMeta('name', 'twitter:card', 'summary_large_image');

    let canonical = document.querySelector('link[rel="canonical"]');
    const createdCanonical = !canonical;
    const originalCanonicalHref = canonical?.getAttribute('href');
    if (createdCanonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(SEO_MARKER, 'true');
    canonical.href = propertyUrl;

    let jsonLdScript = document.querySelector(`script[${JSON_LD_MARKER}]`);
    const createdJsonLd = !jsonLdScript;
    const originalJsonLd = jsonLdScript?.textContent;
    if (createdJsonLd) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.setAttribute(JSON_LD_MARKER, 'true');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(
      propertyStructuredData(property, window.location.origin),
    );

    return () => {
      document.title = originalTitle;
      updatedTags.forEach(({ tag, created, originalContent }) => {
        if (created) {
          tag.remove();
        } else if (originalContent === null) {
          tag.removeAttribute('content');
        } else {
          tag.setAttribute('content', originalContent);
        }
        tag.removeAttribute(SEO_MARKER);
      });

      if (createdCanonical) {
        canonical.remove();
      } else if (originalCanonicalHref === null) {
        canonical.removeAttribute('href');
      } else {
        canonical.setAttribute('href', originalCanonicalHref);
      }
      canonical.removeAttribute(SEO_MARKER);

      if (createdJsonLd) {
        jsonLdScript.remove();
      } else {
        jsonLdScript.textContent = originalJsonLd;
      }
    };
  }, [property, allProperties]);
};
