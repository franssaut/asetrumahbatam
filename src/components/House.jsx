import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Bath, BedDouble, Ruler } from 'lucide-react';
import Card from './Card';
import { properties } from '../data';
import { formatRupiah } from '../format';

const House = () => {
  const slides = useMemo(() => {
    const groups = [];
    for (let i = 0; i < properties.length; i += 3) {
      groups.push(properties.slice(i, i + 3));
    }
    return groups;
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="properti" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 mb-2">Properti Pilihan</p>
          <h2 className="text-3xl font-bold text-gray-900">Jelajahi Listing Terbaik</h2>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-teal-500 hover:text-teal-600"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-teal-500 hover:text-teal-600"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-50 via-white to-sky-50 p-4 shadow-[0_20px_50px_rgba(13,148,136,0.08)] sm:p-6">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full shrink-0 pr-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {slide.map((prop) => (
                  <Card key={`${prop.id}-${prop.title}`} property={prop} onSelect={setSelectedProperty} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              currentSlide === index ? 'w-10 bg-teal-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div
        id={`detail-${selectedProperty.id}`}
        className="mt-12 overflow-hidden rounded-[28px] border border-teal-100 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
      >
        <div className="grid lg:grid-cols-2">
          <img src={selectedProperty.image} alt={selectedProperty.title} className="h-full min-h-[320px] w-full object-cover" />
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">
              {selectedProperty.tag}
            </span>
            <h3 className="mt-4 text-3xl font-bold text-gray-900">{selectedProperty.title}</h3>
            <p className="mt-3 text-2xl font-bold text-teal-600">{formatRupiah(selectedProperty.price)}</p>

            <div className="mt-5 flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 text-teal-600" />
              <span>{selectedProperty.location}</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 p-4 text-center">
              <div>
                <BedDouble className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                <p className="text-sm text-gray-500">Kamar</p>
                <p className="font-semibold text-gray-900">{selectedProperty.beds}</p>
              </div>
              <div>
                <Bath className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                <p className="text-sm text-gray-500">Mandi</p>
                <p className="font-semibold text-gray-900">{selectedProperty.baths}</p>
              </div>
              <div>
                <Ruler className="mx-auto mb-2 h-5 w-5 text-teal-600" />
                <p className="text-sm text-gray-500">Luas</p>
                <p className="font-semibold text-gray-900">{selectedProperty.sqft} m²</p>
              </div>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Properti ini merupakan pilihan utama untuk kebutuhan hunian atau investasi di Batam, dengan lokasi strategis dan harga yang kompetitif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#agen"
                className="inline-flex items-center rounded-lg bg-teal-600 px-5 py-3 font-medium text-white transition hover:bg-teal-700"
              >
                Hubungi Agen
              </a>
              <a
                href="#properti"
                className="inline-flex items-center rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:border-teal-500 hover:text-teal-600"
              >
                Lihat Lainnya
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default House;
