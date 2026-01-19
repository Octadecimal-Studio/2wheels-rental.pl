'use client';

import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { getTestimonials, type StrapiTestimonial } from '@/lib/strapi';

// Fallback testimonials
const fallbackTestimonials = [
  {
    authorName: 'Jan Kowalski',
    rating: 5,
    content: 'Świetna wypożyczalnia! Yamaha R1 w doskonałym stanie, profesjonalna obsługa. Na pewno wrócę!',
  },
  {
    authorName: 'Anna Nowak',
    rating: 5,
    content: 'Wypożyczyłam BMW GS na tydzień. Motocykl jak nowy, wszystko działało perfekcyjnie. Polecam!',
  },
  {
    authorName: 'Marek Wiśniewski',
    rating: 5,
    content: 'Najlepsza wypożyczalnia w mieście. Szybka rezerwacja, przejrzyste warunki, świetne ceny.',
  },
];

interface Testimonial {
  authorName: string;
  rating: number;
  content: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const cmsTestimonials = await getTestimonials();
        
        if (cmsTestimonials && cmsTestimonials.length > 0) {
          setTestimonials(cmsTestimonials.map(t => ({
            authorName: t.authorName || 'Anonim',
            rating: t.rating || 5,
            content: t.content || ''
          })));
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('Błąd pobierania opinii:', error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Co mówią nasi klienci?
            </h2>
            <p className="text-lg text-gray-medium">Ładowanie opinii...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md h-40 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Co mówią nasi klienci?
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Opinie zadowolonych klientów
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-medium mb-4 italic">"{testimonial.content}"</p>
              <p className="font-semibold">{testimonial.authorName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
