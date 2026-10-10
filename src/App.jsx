import React from 'react';
import { Home } from 'lucide-react';
import House from './components/House';
import Detail from './components/Detail';

const App = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Frans Rumah Batam 2</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-teal-600 font-medium">Beranda</a>
              <a href="#properti" className="text-gray-600 hover:text-teal-600 font-medium">Properti</a>
              <a href="#agen" className="text-gray-600 hover:text-teal-600 font-medium">Agen Kami</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-[500px] object-cover"
            src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000&q=80"
            alt="Batam City"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        </div>
        
        <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center h-[500px] flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Aset Rumah Batam
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-3xl mx-auto">
            Temukan properti komersial dan hunian terbaik di Batam.
          </p>
        </div>
      </div>

      <House />
      <Detail />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center mt-10">
        <p>&copy; 2026 Aset Rumah Batam. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
};

export default App;
