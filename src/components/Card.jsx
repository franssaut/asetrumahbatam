import React from 'react';
import { MapPin } from 'lucide-react';
import { formatRupiah } from '../format';

const Card = ({ property, onSelect }) => {
  return (
    <a
      href={`#detail-${property.id}`}
      onClick={() => onSelect(property)}
      className="group block bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <div className="relative h-64">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-4 left-4 bg-teal-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          {property.tag}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-teal-600 mb-2">{formatRupiah(property.price)}</h3>
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h4>
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {property.houseType || 'Rumah'}
          </span>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Type: {property.type}
          </span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
          <span>{property.beds} KT</span>
          <span>{property.baths} KM</span>
          <span>{property.sqft} m²</span>
        </div>
      </div>
    </a>
  );
};

export default Card;
