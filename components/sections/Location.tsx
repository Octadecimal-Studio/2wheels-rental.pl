'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings, type StrapiSiteSettings } from '@/lib/strapi';

// Fallback dane kontaktowe
const fallbackSettings = {
  address: 'ul. Łokuciewskiego 4a m 291, 01-234 Warszawa',
  contactPhone: '+48 123 456 789',
  contactEmail: 'kontakt@2wheels-rental.pl',
  openingHours: 'Pon-Pt: 9:00-18:00, Sob: 10:00-16:00',
  mapCoordinates: '52.2297,21.0122'
};

/**
 * Automatyczne pobieranie współrzędnych z adresu używając Nominatim (OpenStreetMap)
 * Darmowe API bez klucza, limit 1 request/s
 */
async function geocodeAddress(address: string): Promise<string | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': '2Wheels-Rental/1.0 (kontakt@2wheels-rental.pl)'
        }
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return `${lat},${lon}`;
    }
    return null;
  } catch (error) {
    console.error('Błąd geocodingu:', error);
    return null;
  }
}

export default function Location() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const cmsSettings = await getSiteSettings();
        if (cmsSettings) {
          const address = cmsSettings.address || fallbackSettings.address;
          let mapCoordinates = cmsSettings.mapCoordinates;
          
          // Jeśli brak koordynatów w CMS, pobierz automatycznie z adresu
          if (!mapCoordinates && address) {
            console.log('Brak koordynatów w CMS, pobieram z adresu...');
            const coords = await geocodeAddress(address);
            if (coords) {
              mapCoordinates = coords;
              console.log('Pobrano koordynaty:', coords);
            }
          }
          
          setSettings({
            address: address,
            contactPhone: cmsSettings.contactPhone || fallbackSettings.contactPhone,
            contactEmail: cmsSettings.contactEmail || fallbackSettings.contactEmail,
            openingHours: cmsSettings.openingHours || fallbackSettings.openingHours,
            mapCoordinates: mapCoordinates || fallbackSettings.mapCoordinates
          });
        }
      } catch (error) {
        console.error('Błąd pobierania ustawień:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  // Parsowanie współrzędnych do URL mapy
  const getMapUrl = () => {
    const [lat, lng] = settings.mapCoordinates.split(',');
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat},${lng}!5e0!3m2!1spl!2spl!4v1234567890`;
  };

  // Formatowanie adresu
  const formatAddress = () => {
    const parts = settings.address.split(',');
    if (parts.length >= 2) {
      return (
        <>
          {parts[0].trim()}<br />
          {parts.slice(1).join(',').trim()}
        </>
      );
    }
    return settings.address;
  };

  // Formatowanie godzin otwarcia
  const formatHours = () => {
    if (settings.openingHours.includes(',')) {
      return settings.openingHours.split(',').map((line, i) => (
        <span key={i}>
          {line.trim()}
          {i < settings.openingHours.split(',').length - 1 && <br />}
        </span>
      ));
    }
    return settings.openingHours;
  };

  return (
    <section id="kontakt" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Gdzie nas znajdziesz?
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Odwiedź naszą wypożyczalnię
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mapa */}
          <div className="bg-gray-light rounded-xl overflow-hidden h-96">
            <iframe
              src={getMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Informacje */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-bold mb-2">Adres</h3>
              <p className="text-gray-medium">
                {loading ? 'Ładowanie...' : formatAddress()}
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold mb-2">Kontakt</h3>
              <p className="text-gray-medium">
                Telefon: <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-accent-red hover:underline">{settings.contactPhone}</a>
                <br />
                Email: <a href={`mailto:${settings.contactEmail}`} className="text-accent-red hover:underline">{settings.contactEmail}</a>
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold mb-2">Godziny otwarcia</h3>
              <p className="text-gray-medium">
                {loading ? 'Ładowanie...' : formatHours()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
