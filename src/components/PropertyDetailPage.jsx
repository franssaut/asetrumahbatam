import React from 'react';
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { PropertyDataNotice, useProperties } from '../PropertiesContext';
import { formatRupiah, propertyPath } from '../format';

const PropertyDetailPage = () => {
  const { id, slug } = useParams();
  const location = useLocation();
  const { properties, status } = useProperties();
  const propertyId = id || slug?.match(/-(\d+)$/)?.[1];
  const property = properties.find((item) => item.id === Number(propertyId));
  const propertyUrl = property
    ? new URL(propertyPath(property), window.location.origin).href
    : '';
  const gallery = property?.gallery?.length ? property.gallery : [property?.image].filter(Boolean);
  const [selectedImage, setSelectedImage] = React.useState(gallery[0] || '');

  React.useEffect(() => {
    if (gallery.length) {
      setSelectedImage(gallery[0]);
    }
  }, [property?.id]);

  React.useEffect(() => {
    if (!property) return undefined;

    const originalTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const originalDescription = descriptionMeta?.content;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const originalCanonical = canonicalLink?.href;
    const metaDescription = descriptionMeta || document.createElement('meta');
    const canonical = canonicalLink || document.createElement('link');

    if (!descriptionMeta) {
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    if (!canonicalLink) {
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    document.title = `${property.title} di ${property.location} | Aset Rumah Batam`;
    metaDescription.content = property.description;
    canonical.href = new URL(propertyPath(property), window.location.origin).href;

    return () => {
      document.title = originalTitle;
      if (originalDescription === undefined) metaDescription.remove();
      else metaDescription.content = originalDescription;
      if (originalCanonical === undefined) canonical.remove();
      else canonical.href = originalCanonical;
    };
  }, [property]);

  if (property && location.pathname !== propertyPath(property)) {
    return <Navigate replace to={propertyPath(property)} />;
  }

  if (!property) {
    if (status === 'loading') {
      return (
        <div className="mx-auto max-w-4xl px-4 py-32 text-center" role="status">
          Memuat data properti...
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Properti tidak ditemukan</h1>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-lg bg-teal-600 px-5 py-3 text-white hover:bg-teal-700"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-28">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-teal-500 hover:text-teal-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>

      <div className="mt-6">
        <PropertyDataNotice />
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] bg-white shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
        <div className="grid lg:grid-cols-2">
          <div className="p-4 sm:p-6">
            <img
              src={selectedImage}
              alt={property.title}
              className="h-[340px] w-full rounded-[24px] bg-slate-100 object-contain shadow-md sm:h-[440px]"
            />

            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === image ? 'border-teal-500 shadow-md' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${property.title} ${index + 1}`} className="h-20 w-full bg-slate-100 object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                {property.houseType || 'Rumah'}
              </span>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Type: {property.type}
              </span>
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {property.tag}
              </span>
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Cara bayar: {property.paymentMethod || 'Cash Bertahap'}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{property.title}</h1>
            <p className="mt-4 text-2xl font-bold text-teal-600">{formatRupiah(property.price)}</p>

            <div className="mt-5 flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 text-teal-600" />
              <span>{property.location}</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 p-4 text-center">
              <div>
                <BedDouble className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                <p className="text-sm text-gray-500">Kamar</p>
                <p className="font-semibold text-gray-900">{property.beds}</p>
              </div>
              <div>
                <Bath className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                <p className="text-sm text-gray-500">Mandi</p>
                <p className="font-semibold text-gray-900">{property.baths}</p>
              </div>
              <div>
                <Ruler className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                <p className="text-sm text-gray-500">Luas</p>
                <p className="font-semibold text-gray-900">{property.sqft} m²</p>
              </div>
            </div>

            <p className="mt-6 text-base leading-7 text-gray-600">
              {property.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/6282391059216?text=${encodeURIComponent(`Halo, saya tertarik dengan ${property.title} di ${property.location}. Berikut link propertinya: ${propertyUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-teal-600 px-5 py-3 font-medium text-white transition hover:bg-teal-700"
              >
                Hubungi Agen
              </a>
              <Link
                to="/"
                className="inline-flex items-center rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:border-teal-500 hover:text-teal-600"
              >
                Lihat Properti Lain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
