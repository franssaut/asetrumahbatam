import React from 'react';
import Card from './Card';
import { properties } from '../data';

const House = () => {
  return (
    <div id="properti" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Properti Pilihan</h2>
        <p className="text-lg text-gray-600">Jelajahi listing terbaik dari Aset Rumah Batam</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((prop) => (
          <Card key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
};

export default House;
