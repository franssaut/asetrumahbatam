import React from 'react';
import { Home, Menu, X } from 'lucide-react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import House from './components/House';
import Detail from './components/Detail';
import PropertyDetailPage from './components/PropertyDetailPage';
import { PropertiesProvider } from './PropertiesContext';

const HomePage = () => (
  <>
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
          Jupen Rumah
        </h1>
        <p className="mt-4 text-xl text-gray-200 max-w-3xl mx-auto">
          Temukan properti komersial dan hunian terbaik di Batam.
        </p>
      </div>
    </div>

    <House />
    <Detail />
  </>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <PropertiesProvider>
        <div className="min-h-screen font-sans">
          <nav className="bg-white shadow-md fixed w-full z-10 top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <Home className="h-7 w-7 text-teal-600 sm:h-8 sm:w-8" />
                <span className="ml-2 text-lg font-bold text-gray-900 sm:text-2xl">Aset Rumah Batam</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-teal-600 font-medium">Beranda</Link>
                <a href="/#properti" className="text-gray-600 hover:text-teal-600 font-medium">Properti</a>
                <a href="/#agen" className="text-gray-600 hover:text-teal-600 font-medium">Agen Kami</a>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
                aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div id="mobile-navigation" className={`${isMenuOpen ? 'block' : 'hidden'} border-t border-gray-100 bg-white md:hidden`}>
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
              <Link to="/" className="py-3 font-medium text-gray-700 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
                Beranda
              </Link>
              <a href="/#properti" className="py-3 font-medium text-gray-700 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
                Properti
              </a>
              <a href="/#agen" className="py-3 font-medium text-gray-700 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
                Agen Kami
              </a>
            </div>
          </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
          </Routes>

          <footer className="bg-gray-900 text-white py-8 text-center mt-10">
            <p>&copy; 2026 Aset Rumah Batam. Hak Cipta Dilindungi.</p>
          </footer>
        </div>
      </PropertiesProvider>
    </BrowserRouter>
  );
};

export default App;
