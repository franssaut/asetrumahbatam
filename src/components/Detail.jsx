import React from 'react';
import { Star } from 'lucide-react';

const Detail = () => {
  return (
    <div id="agen" className="bg-teal-50 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5">
            <img 
              src="/asset/img/fotoagent.jpeg" 
              alt="Frans Hutapea" 
              className="w-full h-full object-cover min-h-[400px]"
            />
          </div>
          <div className="p-10 md:w-3/5 flex flex-col justify-center">
            <div className="flex items-center space-x-1 text-yellow-400 mb-4">
              <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frans Hutapea</h2>
            <p className="text-teal-600 font-semibold text-lg mb-6">Pemasar Utama - Aset Rumah Batam</p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Halo! Saya siap membantu Anda menemukan properti idaman di Batam. Saat ini saya memasarkan unit eksklusif di <span className="font-bold text-gray-800">Prumahan di batam</span> dan berbagai properti residensial lainnya.
            </p>
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition w-max">
              Hubungi Frans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
