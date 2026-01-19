'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { getBikes, formatBikeFromCMS, createReservation } from '@/lib/strapi';
import bikesDataFallback from '@/data/bikes.json';

const formSchema = z.object({
  bikeId: z.string().min(1, 'Wybierz motocykl'),
  pickupDate: z.string().min(1, 'Podaj datę odbioru'),
  returnDate: z.string().min(1, 'Podaj datę zwrotu'),
  name: z.string().min(2, 'Imię i nazwisko jest wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Numer telefonu jest wymagany'),
  notes: z.string().optional(),
  rodo: z.boolean().refine(val => val === true, 'Musisz zaakceptować zgodę RODO'),
});

type FormData = z.infer<typeof formSchema>;

interface Bike {
  id: number;
  name: string;
  brand: string;
}

export default function ContactForm() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Obserwuj wybrany motocykl
  const selectedBikeId = watch('bikeId');

  // Pobierz listę motocykli z CMS
  useEffect(() => {
    async function fetchBikes() {
      try {
        const cmsBikes = await getBikes();
        
        if (cmsBikes && cmsBikes.length > 0) {
          const formattedBikes = cmsBikes.map(formatBikeFromCMS);
          setBikes(formattedBikes);
        } else {
          setBikes(bikesDataFallback.bikes);
        }
      } catch (error) {
        console.error('Błąd pobierania danych z CMS:', error);
        setBikes(bikesDataFallback.bikes);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBikes();
  }, []);

  // Nasłuchuj na event wyboru motocykla z BikeCard
  useEffect(() => {
    function handleBikeSelected(event: CustomEvent<{ id: number; name: string }>) {
      const { id } = event.detail;
      setValue('bikeId', id.toString());
    }

    // Sprawdź localStorage przy starcie
    if (typeof window !== 'undefined') {
      const savedBike = localStorage.getItem('selectedBike');
      if (savedBike) {
        try {
          const { id } = JSON.parse(savedBike);
          setValue('bikeId', id.toString());
          localStorage.removeItem('selectedBike');
        } catch (e) {
          // Ignoruj błędy parsowania
        }
      }
    }

    window.addEventListener('bikeSelected', handleBikeSelected as EventListener);
    return () => {
      window.removeEventListener('bikeSelected', handleBikeSelected as EventListener);
    };
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    // Znajdź wybrany motocykl
    const selectedBike = bikes.find(b => b.id.toString() === data.bikeId);
    const bikeName = selectedBike ? `${selectedBike.brand} ${selectedBike.name}` : 'Nieznany';

    try {
      const result = await createReservation({
        bikeId: parseInt(data.bikeId),
        bikeName: bikeName,
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
        reset();
        setTimeout(() => setIsSubmitted(false), 10000);
      } else {
        setError(result.error || 'Wystąpił błąd podczas wysyłania rezerwacji');
      }
    } catch (err) {
      console.error('Błąd wysyłania rezerwacji:', err);
      setError('Wystąpił błąd połączenia. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rezerwacja" className="py-20 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Zarezerwuj motocykl
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Wypełnij formularz, a skontaktujemy się z Tobą
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">Dziękujemy!</p>
              <p>Twoja rezerwacja została przyjęta. Skontaktujemy się z Tobą wkrótce aby potwierdzić szczegóły.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Wybór motocykla */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Wybór motocykla *
                </label>
                <select
                  {...register('bikeId')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  disabled={loading}
                >
                  <option value="">{loading ? 'Ładowanie...' : '-- Wybierz motocykl --'}</option>
                  {bikes.map(bike => (
                    <option key={bike.id} value={bike.id}>
                      {bike.brand} {bike.name}
                    </option>
                  ))}
                </select>
                {errors.bikeId && (
                  <p className="text-red-600 text-sm mt-1">{errors.bikeId.message}</p>
                )}
              </div>

              {/* Daty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Data odbioru *
                  </label>
                  <input
                    type="date"
                    {...register('pickupDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  {errors.pickupDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.pickupDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Data zwrotu *
                  </label>
                  <input
                    type="date"
                    {...register('returnDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  {errors.returnDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.returnDate.message}</p>
                  )}
                </div>
              </div>

              {/* Dane kontaktowe */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Jan Kowalski"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="jan@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+48 123 456 789"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Uwagi */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Uwagi
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  placeholder="Dodatkowe informacje, pytania..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-red"
                />
              </div>

              {/* RODO */}
              <div>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    {...register('rodo')}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-medium">
                    Akceptuję <a href="/polityka-prywatnosci" className="text-accent-red hover:underline">politykę prywatności</a> i wyrażam zgodę na przetwarzanie moich danych osobowych. *
                  </span>
                </label>
                {errors.rodo && (
                  <p className="text-red-600 text-sm mt-1">{errors.rodo.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-accent-red text-white hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij rezerwację'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
