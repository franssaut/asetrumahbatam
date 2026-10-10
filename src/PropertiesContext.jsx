import React, { createContext, useContext, useEffect, useState } from 'react';
import { properties as localProperties } from './data';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const PropertiesContext = createContext(null);

export const PropertiesProvider = ({ children }) => {
  const [properties, setProperties] = useState(localProperties);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'local');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;

    const loadProperties = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('properties')
          .select('*')
          .order('id', { ascending: true });

        if (queryError) throw queryError;

        if (!data?.length) {
          throw new Error('Tabel public.properties belum berisi data. Jalankan supabase/schema.sql.');
        }

        if (!isMounted) return;

        setProperties(data.map((row) => ({
          id: Number(row.id),
          type: Number(row.type),
          houseType: row.house_type || 'Rumah',
          title: row.title,
          price: Number(row.price),
          location: row.location,
          beds: Number(row.beds),
          baths: Number(row.baths),
          sqft: Number(row.sqft),
          image: row.image,
          gallery: Array.isArray(row.gallery) ? row.gallery : [row.image],
          tag: row.tag,
          description: row.description || '',
          agent: row.agent || '',
        })));
        setError('');
        setStatus('remote');
      } catch (requestError) {
        if (!isMounted) return;
        setProperties(localProperties);
        setError(requestError.message || 'Tidak dapat terhubung ke Supabase.');
        setStatus('fallback');
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PropertiesContext.Provider value={{ properties, status, error }}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => useContext(PropertiesContext);

export const PropertyDataNotice = () => {
  const { status, error } = useProperties();

  if (status === 'remote') return null;

  const message = status === 'loading'
    ? 'Menghubungkan ke Supabase...'
    : status === 'fallback'
      ? `${error} Menampilkan data lokal.`
      : 'Supabase belum dikonfigurasi. Menampilkan data lokal.';

  return (
    <p
      role={status === 'fallback' ? 'alert' : 'status'}
      className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      {message}
    </p>
  );
};