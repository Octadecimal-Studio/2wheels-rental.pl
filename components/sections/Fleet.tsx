'use client';

import { useState, useMemo, useEffect } from 'react';
import BikeCard from '../BikeCard';
import { getBikes, formatBikeFromCMS, type StrapiBike } from '@/lib/strapi';

// Fallback data jeśli CMS niedostępny
import bikesDataFallback from '@/data/bikes.json';

const defaultCategories = ['wszystkie', 'sport', 'cruiser', 'touring', 'adventure', 'naked', 'beginner', 'pitbike'];

interface Bike {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceWeek: number;
  priceMonth: number;
  capacity: string;
  year: number;
  available: boolean;
  description: string;
  specs: Record<string, string | number>;
  image: string;
}

export default function Fleet() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');
  const [selectedBrand, setSelectedBrand] = useState('wszystkie');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700]);

  // Pobierz dane z CMS
  useEffect(() => {
    async function fetchBikes() {
      try {
        const cmsBikes = await getBikes();
        
        if (cmsBikes && cmsBikes.length > 0) {
          // Mamy dane z CMS
          const formattedBikes = cmsBikes.map(formatBikeFromCMS);
          setBikes(formattedBikes);
        } else {
          // Fallback do statycznych danych
          console.log('Używam danych fallback (CMS pusty lub niedostępny)');
          setBikes(bikesDataFallback.bikes);
        }
      } catch (error) {
        console.error('Błąd pobierania danych z CMS:', error);
        // Fallback do statycznych danych
        setBikes(bikesDataFallback.bikes);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBikes();
  }, []);

  // Dynamicznie generuj listę kategorii i marek z dostępnych motocykli
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(bikes.map(b => b.category))];
    return ['wszystkie', ...uniqueCategories.sort()];
  }, [bikes]);

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(bikes.map(b => b.brand))];
    return ['wszystkie', ...uniqueBrands.sort()];
  }, [bikes]);

  // Maksymalna cena do slidera
  const maxPrice = useMemo(() => {
    if (bikes.length === 0) return 700;
    return Math.max(...bikes.map(b => b.price)) + 50;
  }, [bikes]);

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const categoryMatch = selectedCategory === 'wszystkie' || bike.category.toLowerCase() === selectedCategory.toLowerCase();
      const brandMatch = selectedBrand === 'wszystkie' || bike.brand === selectedBrand;
      const priceMatch = bike.price >= priceRange[0] && bike.price <= priceRange[1];
      return categoryMatch && brandMatch && priceMatch;
    });
  }, [bikes, selectedCategory, selectedBrand, priceRange]);

  // Loading state
  if (loading) {
    return (
      <section id="motocykle" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Wybierz swój motocykl
            </h2>
            <p className="text-lg text-gray-medium max-w-2xl mx-auto">
              Ładowanie motocykli...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="motocykle" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Wybierz swój motocykl
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Przeglądaj naszą flotę i znajdź idealny motocykl dla siebie
          </p>
        </div>

        {/* Filtry */}
        <div className="mb-8 bg-gray-light p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kategoria */}
            <div>
              <label className="block text-sm font-semibold mb-2">Kategoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'wszystkie' ? 'Wszystkie' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Marka */}
            <div>
              <label className="block text-sm font-semibold mb-2">Marka</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === 'wszystkie' ? 'Wszystkie' : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Cena */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Cena: do {priceRange[1]} zł/dzień
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Lista motocykli */}
        {filteredBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBikes.map(bike => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-medium text-lg">Nie znaleziono motocykli spełniających kryteria</p>
          </div>
        )}
      </div>
    </section>
  );
}
