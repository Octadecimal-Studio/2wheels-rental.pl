import Image from 'next/image';
import { getAssetPath } from '@/lib/paths';

const features = [
  {
    icon: getAssetPath('/img/icons/icon-models.svg'),
    title: 'Najnowsze modele',
    description: 'Flota składająca się z najnowszych modeli 2023-2024',
  },
  {
    icon: getAssetPath('/img/icons/icon-insurance.svg'),
    title: 'Pełne ubezpieczenie',
    description: 'Wszystkie motocykle w pełni ubezpieczone',
  },
  {
    icon: getAssetPath('/img/icons/icon-service.svg'),
    title: 'Profesjonalna obsługa',
    description: 'Doświadczony zespół gotowy pomóc w każdej chwili',
  },
  {
    icon: getAssetPath('/img/icons/icon-location.svg'),
    title: 'Dogodna lokalizacja',
    description: 'Centralnie położona wypożyczalnia w Warszawie',
  },
  {
    icon: getAssetPath('/img/icons/icon-price.svg'),
    title: 'Atrakcyjne ceny',
    description: 'Najlepsze ceny na rynku, bez ukrytych kosztów',
  },
  {
    icon: getAssetPath('/img/icons/icon-fast.svg'),
    title: 'Szybka rezerwacja',
    description: 'Rezerwacja online w kilka minut',
  },
];

export default function WhyUs() {
  return (
    <section id="o-nas" className="py-20 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Dlaczego wybrać naszą wypożyczalnię?
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Oferujemy najlepsze warunki wypożyczenia i profesjonalną obsługę
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="w-full h-full"
                />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
