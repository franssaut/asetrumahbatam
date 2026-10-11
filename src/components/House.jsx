import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Bath, BedDouble, Ruler } from 'lucide-react';
import Card from './Card';
import { PropertyDataNotice, useProperties } from '../PropertiesContext';
import { formatRupiah } from '../format';

const createSlides = (items) => {
  const slides = [];
  for (let index = 0; index < items.length; index += 3) {
    slides.push(items.slice(index, index + 3));
  }
  return slides;
};

const LocationCarousel = ({ location, items }) => {
  const slides = useMemo(() => createSlides(items), [items]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMobileItem, setCurrentMobileItem] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mobileTrackRef = useRef(null);

  useEffect(() => {
    if (slides.length < 2 || isPaused) return undefined;

    const intervalId = window.setInterval(() => {
      if (window.matchMedia('(min-width: 640px)').matches) {
        setCurrentSlide((previous) => (previous + 1) % slides.length);
      }
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [slides.length, isPaused]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const scrollToMobileItem = (index) => {
    const track = mobileTrackRef.current;
    const card = track?.children[index];
    if (!track || !card) return;

    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
    track.scrollTo({
      left: track.scrollLeft + cardCenter - trackCenter,
      behavior: 'smooth',
    });
    setCurrentMobileItem(index);
  };

  const handleMobileScroll = (event) => {
    const track = event.currentTarget;
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    const closestIndex = Array.from(track.children).reduce((closest, card, index, cards) => {
      const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
      const closestCenter = cards[closest].getBoundingClientRect().left + cards[closest].clientWidth / 2;
      const cardDistance = Math.abs(cardCenter - trackCenter);
      const closestDistance = Math.abs(closestCenter - trackCenter);
      return cardDistance < closestDistance ? index : closest;
    }, 0);

    setCurrentMobileItem((previous) => (previous === closestIndex ? previous : closestIndex));
  };

  return (
    <div
      className="mb-12 last:mb-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">Lokasi</p>
          <h3 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">{location}</h3>
        </div>

        {slides.length > 1 && (
          <div className="hidden shrink-0 items-center gap-2 sm:flex sm:gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-teal-500 hover:text-teal-600 sm:h-11 sm:w-11"
              aria-label={`Previous slide for ${location}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-teal-500 hover:text-teal-600 sm:h-11 sm:w-11"
              aria-label={`Next slide for ${location}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="sm:hidden">
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4"
        >
          {items.map((property) => (
            <div key={property.id} className="w-full shrink-0 snap-center">
              <Card property={property} />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => scrollToMobileItem((currentMobileItem - 1 + items.length) % items.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm"
              aria-label={`Previous property for ${location}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {items.map((property, index) => (
              <button
                key={`${property.id}-mobile-dot`}
                type="button"
                onClick={() => scrollToMobileItem(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentMobileItem === index ? 'w-8 bg-teal-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to property ${index + 1} for ${location}`}
              />
            ))}
            <button
              type="button"
              onClick={() => scrollToMobileItem((currentMobileItem + 1) % items.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm"
              aria-label={`Next property for ${location}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-white to-sky-50 p-2 shadow-[0_20px_40px_rgba(13,148,136,0.08)] sm:rounded-[24px] sm:p-6">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={`${location}-${index}`} className="w-full shrink-0">
                <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {slide.map((property) => (
                    <Card key={property.id} property={property} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`${location}-dot-${index}`}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === index ? 'w-10 bg-teal-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1} for ${location}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const House = () => {
  const { properties } = useProperties();
  const locationGroups = useMemo(() => {
    const groups = new Map();

    properties.forEach((property) => {
      if (!groups.has(property.location)) {
        groups.set(property.location, []);
      }
      groups.get(property.location).push(property);
    });

    return Array.from(groups.entries()).map(([location, items]) => ({
      location,
      items,
    }));
  }, []);

  return (
    <div id="properti" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <PropertyDataNotice />
      <div className="mb-10 text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 mb-2">Properti Pilihan</p>
        <h2 className="text-3xl font-bold text-gray-900">Jelajahi Listing Terbaik</h2>
      </div>

      {locationGroups.map(({ location, items }) => (
        <LocationCarousel key={location} location={location} items={items} />
      ))}
    </div>
  );
};

export default House;
