'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/paths';

interface Bike {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  capacity: string;
  year: number;
  image: string;
  available: boolean;
}

interface BikeCardProps {
  bike: Bike;
}

/**
 * Zwraca poprawną ścieżkę do obrazu
 * Obsługuje zarówno lokalne ścieżki jak i URL z CMS
 */
function getImageUrl(imagePath: string): string {
  // Jeśli to pełny URL (z CMS) - zwróć bez zmian
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // W przeciwnym razie użyj lokalnej ścieżki
  return getAssetPath(imagePath);
}

/**
 * Przewija do sekcji rezerwacji i ustawia wybrany motocykl
 */
function scrollToReservation(bikeId: number, bikeName: string) {
  // Ustaw dane w localStorage żeby formularz mógł je odczytać
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedBike', JSON.stringify({ id: bikeId, name: bikeName }));
    
    // Wyemituj custom event żeby formularz mógł zareagować
    window.dispatchEvent(new CustomEvent('bikeSelected', { 
      detail: { id: bikeId, name: bikeName } 
    }));
    
    // Przewiń do sekcji rezerwacji
    const reservationSection = document.getElementById('rezerwacja');
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

export default function BikeCard({ bike }: BikeCardProps) {
  const categoryLabels: Record<string, string> = {
    sport: 'Sportowy',
    cruiser: 'Cruiser',
    touring: 'Touring',
    adventure: 'Adventure',
    naked: 'Naked',
  };

  const imageUrl = getImageUrl(bike.image);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/motocykl/${bike.id}/`} className="block relative h-64 cursor-pointer">
        <Image
          src={imageUrl}
          alt={bike.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          unoptimized={imageUrl.startsWith('http')}
        />
        {!bike.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Niedostępny
            </span>
          </div>
        )}
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link href={`/motocykl/${bike.id}/`} className="hover:text-accent-red transition-colors">
              <h3 className="font-heading text-xl font-bold">{bike.name}</h3>
            </Link>
            <p className="text-gray-medium">{bike.brand}</p>
          </div>
          <span className="bg-accent-red text-white px-3 py-1 rounded text-sm font-semibold">
            {categoryLabels[bike.category] || bike.category}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-medium">
          <span>{bike.capacity}</span>
          <span>•</span>
          <span>Rok {bike.year}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-accent-red">{bike.price} zł</div>
            <div className="text-sm text-gray-medium">za dzień</div>
          </div>
          <button
            onClick={() => scrollToReservation(bike.id, `${bike.brand} ${bike.name}`)}
            disabled={!bike.available}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              bike.available
                ? 'bg-accent-red text-white hover:bg-red-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Rezerwuj
          </button>
        </div>
      </div>
    </div>
  );
}
