import Link from 'next/link';
import Image from 'next/image';
import { getAssetPath } from '@/lib/paths';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getAssetPath('/img/hero-bike.jpg')}
          alt="Hero Motorcycle"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Wypożycz motocykl
          <br />
          <span className="text-accent-red">swoich marzeń</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Najlepsze modele, najlepsze ceny, niezapomniane przeżycia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="#motocykle"
            className="bg-accent-red text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
          >
            Zobacz ofertę
          </Link>
          <Link
            href="#rezerwacja"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-black transition-colors"
          >
            Rezerwuj teraz
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-accent-red mb-2">50+</div>
            <div className="text-gray-300">Motocykli</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-red mb-2">1000+</div>
            <div className="text-gray-300">Zadowolonych klientów</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-red mb-2">24/7</div>
            <div className="text-gray-300">Wsparcie</div>
          </div>
        </div>
      </div>
    </section>
  );
}
