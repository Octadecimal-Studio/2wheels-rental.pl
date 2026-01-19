'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetPath } from '@/lib/paths';
import { getSiteSettings } from '@/lib/strapi';

// Fallback dane kontaktowe
const fallbackSettings = {
  address: 'ul. Łokuciewskiego 4a m 291',
  city: '01-234 Warszawa',
  contactPhone: '+48 123 456 789',
  contactEmail: 'kontakt@2wheels-rental.pl'
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(fallbackSettings);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const cmsSettings = await getSiteSettings();
        if (cmsSettings) {
          // Parsuj adres
          const addressParts = (cmsSettings.address || fallbackSettings.address).split(',');
          setSettings({
            address: addressParts[0]?.trim() || fallbackSettings.address,
            city: addressParts.slice(1).join(',').trim() || fallbackSettings.city,
            contactPhone: cmsSettings.contactPhone || fallbackSettings.contactPhone,
            contactEmail: cmsSettings.contactEmail || fallbackSettings.contactEmail
          });
        }
      } catch (error) {
        console.error('Błąd pobierania ustawień:', error);
      }
    }
    
    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo i opis */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={getAssetPath('/img/logo.svg')}
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-heading text-xl font-bold">2Wheels Rental</span>
            </div>
            <p className="text-gray-400 mb-4">
              Profesjonalna wypożyczalnia motocykli w Warszawie. Najlepsze modele, najlepsze ceny, niezapomniane przeżycia.
            </p>
          </div>

          {/* Linki */}
          <div>
            <h3 className="font-heading font-bold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#o-nas" className="text-gray-400 hover:text-white transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="#motocykle" className="text-gray-400 hover:text-white transition-colors">
                  Motocykle
                </Link>
              </li>
              <li>
                <Link href="#cennik" className="text-gray-400 hover:text-white transition-colors">
                  Cennik
                </Link>
              </li>
              <li>
                <Link href="#kontakt" className="text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-heading font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{settings.address}</li>
              <li>{settings.city}</li>
              <li>tel: {settings.contactPhone}</li>
              <li>email: {settings.contactEmail}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} 2Wheels Rental. Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/polityka-prywatnosci" className="text-gray-400 hover:text-white text-sm transition-colors">
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="text-gray-400 hover:text-white text-sm transition-colors">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
