'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiSettings, FiShield, FiAward, FiHome } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBikes, getStrapiMediaUrl, createReservation, type StrapiBike } from '@/lib/strapi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema walidacji formularza
const reservationSchema = z.object({
  pickupDate: z.string().min(1, 'Wybierz datę odbioru'),
  returnDate: z.string().min(1, 'Wybierz datę zwrotu'),
  name: z.string().min(2, 'Podaj imię i nazwisko'),
  email: z.string().email('Podaj prawidłowy email'),
  phone: z.string().min(9, 'Podaj prawidłowy numer telefonu'),
  notes: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'Wymagana zgoda'),
});

type FormData = z.infer<typeof reservationSchema>;

// Kategorie w języku polskim
const categoryLabels: Record<string, string> = {
  sport: 'Sportowy',
  cruiser: 'Cruiser',
  touring: 'Touring',
  adventure: 'Adventure',
  naked: 'Naked',
};

interface BikeDetailClientProps {
  bikeId: string;
}

export default function BikeDetailClient({ bikeId }: BikeDetailClientProps) {
  const router = useRouter();
  const [bike, setBike] = useState<StrapiBike | null>(null);
  const [allBikes, setAllBikes] = useState<StrapiBike[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(reservationSchema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const bikes = await getBikes();
        setAllBikes(bikes);
        
        const id = parseInt(bikeId);
        const foundBike = bikes.find(b => b.id === id);
        
        if (foundBike) {
          setBike(foundBike);
          setSelectedImage(getStrapiMediaUrl(foundBike.image));
        }
      } catch (err) {
        console.error('Błąd pobierania danych:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [bikeId]);

  const onSubmit = async (data: FormData) => {
    if (!bike) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createReservation({
        bikeId: bike.id,
        bikeName: `${bike.brand} ${bike.name}`,
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        notes: data.notes || '',
        status: 'pending',
      });
      
      if (result.success) {
        setIsSubmitted(true);
        // Automatyczne przekierowanie na stronę główną po 3 sekundach
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(result.error || 'Błąd zapisu rezerwacji');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Zdjęcia innych motocykli dla galerii
  const otherBikesImages = allBikes
    .filter(b => b.id !== bike?.id && b.image)
    .slice(0, 6)
    .map(b => ({ id: b.id, url: getStrapiMediaUrl(b.image) }));

  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  // Formatuj dzisiejszą datę do min w polu daty
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="aspect-video bg-gray-200 rounded-xl" />
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl font-bold mb-4">Motocykl nie znaleziony</h1>
            <p className="text-gray-600 mb-8">Nie znaleziono motocykla o podanym ID.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/" className="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                <FiHome /> Strona główna
              </Link>
              <a href="/#motocykle" className="inline-flex items-center gap-2 text-accent-red hover:underline">
                <FiArrowLeft /> Wszystkie motocykle
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = getStrapiMediaUrl(bike.image);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero sekcja z motocyklem */}
      <div className="pt-28 pb-12 bg-gradient-to-br from-primary-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <FiHome /> Strona główna
            </Link>
            <span className="text-white/30">|</span>
            <a href="/#motocykle" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <FiArrowLeft /> Wszystkie motocykle
            </a>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Zdjęcie główne */}
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(selectedImage || mainImage)}
                  alt={bike.name}
                  fill
                  className="object-cover"
                  unoptimized={(selectedImage || mainImage).startsWith('http')}
                  priority
                />
              </div>
              
              {!bike.available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-xl">
                    Aktualnie niedostępny
                  </span>
                </div>
              )}
            </div>
            
            {/* Informacje */}
            <div className="text-white">
              <span className="inline-block bg-accent-red px-4 py-1 rounded text-sm font-semibold mb-4">
                {categoryLabels[bike.category] || bike.category}
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">
                {bike.name}
              </h1>
              <p className="text-2xl text-white/70 mb-6">{bike.brand}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <FiSettings className="text-accent-red" />
                  <span>{bike.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-accent-red" />
                  <span>Rok {bike.year}</span>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-accent-red">{bike.price} zł</div>
                    <div className="text-sm text-white/70">za dzień</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent-red">{bike.priceWeek} zł</div>
                    <div className="text-sm text-white/70">za tydzień</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent-red">{bike.priceMonth} zł</div>
                    <div className="text-sm text-white/70">za miesiąc</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Opis i specyfikacja */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Opis */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold mb-6">Opis motocykla</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {bike.description || `${bike.brand} ${bike.name} to wyjątkowy motocykl z kategorii ${categoryLabels[bike.category] || bike.category}. Z silnikiem o pojemności ${bike.capacity} i rocznikiem ${bike.year}, oferuje niesamowite wrażenia z jazdy. Idealny wybór zarówno dla doświadczonych motocyklistów, jak i tych, którzy szukają niezapomnianych przygód na dwóch kółkach.`}
              </p>
              
              {/* Cechy */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiShield className="text-accent-red text-xl" />
                  <span>Pełne ubezpieczenie</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiSettings className="text-accent-red text-xl" />
                  <span>Serwisowany</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiAward className="text-accent-red text-xl" />
                  <span>Najwyższa jakość</span>
                </div>
              </div>
            </div>
            
            {/* Specyfikacja */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6">Specyfikacja</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Marka</span>
                  <span className="font-semibold">{bike.brand}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Model</span>
                  <span className="font-semibold">{bike.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Kategoria</span>
                  <span className="font-semibold">{categoryLabels[bike.category] || bike.category}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Pojemność</span>
                  <span className="font-semibold">{bike.capacity}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Rok produkcji</span>
                  <span className="font-semibold">{bike.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dostępność</span>
                  <span className={`font-semibold ${bike.available ? 'text-green-600' : 'text-red-600'}`}>
                    {bike.available ? 'Dostępny' : 'Niedostępny'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Galeria innych motocykli */}
      {otherBikesImages.length > 0 && (
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold mb-6">Zobacz też inne motocykle</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {otherBikesImages.map((img, index) => (
                <a 
                  key={index}
                  href={`/motocykl/${img.id}/`}
                  className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 hover:scale-105 transition-all duration-300"
                >
                  <Image
                    src={getImageUrl(img.url)}
                    alt={`Motocykl ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={img.url.startsWith('http')}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Formularz rezerwacji */}
      <div id="rezerwacja" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-2 text-center">
              Zarezerwuj {bike.brand} {bike.name}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Wypełnij formularz, a skontaktujemy się z Tobą
            </p>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h3 className="font-heading text-2xl font-bold text-green-800 mb-2">
                  Rezerwacja wysłana!
                </h3>
                <p className="text-green-700 mb-2">
                  Dziękujemy za rezerwację. Skontaktujemy się z Tobą w ciągu 24 godzin.
                </p>
                <p className="text-green-600 text-sm">
                  Za chwilę zostaniesz przekierowany na stronę główną...
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center gap-2 mt-6 bg-accent-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <FiHome /> Wróć na stronę główną
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-xl p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data odbioru *</label>
                    <input
                      type="date"
                      {...register('pickupDate')}
                      min={today}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-red focus:border-transparent"
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data zwrotu *</label>
                    <input
                      type="date"
                      {...register('returnDate')}
                      min={today}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-red focus:border-transparent"
                    />
                    {errors.returnDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.returnDate.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Imię i nazwisko *</label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Jan Kowalski"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-red focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="jan@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-red focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon *</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+48 123 456 789"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-red focus:border-transparent"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Uwagi (opcjonalnie)</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Dodatkowe informacje, pytania..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent-red focus:border-transparent"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      {...register('consent')}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      Akceptuję <Link href="/polityka-prywatnosci" className="text-accent-red hover:underline">politykę prywatności</Link> i wyrażam zgodę na przetwarzanie moich danych osobowych. *
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !bike.available}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                    bike.available && !isSubmitting
                      ? 'bg-accent-red text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Wysyłanie...' : bike.available ? 'Wyślij rezerwację' : 'Motocykl niedostępny'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
