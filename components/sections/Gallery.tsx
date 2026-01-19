'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getBikes, getStrapiMediaUrl, type StrapiBike } from '@/lib/strapi';

// Fallback do lokalnych danych
import bikesDataFallback from '@/data/bikes.json';

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const bikes = await getBikes();
        
        if (bikes && bikes.length > 0) {
          // Pobierz obrazy z CMS
          const cmsImages = bikes
            .filter(bike => bike.image !== null)
            .map(bike => getStrapiMediaUrl(bike.image));
          
          if (cmsImages.length > 0) {
            setImages(cmsImages);
          } else {
            // Fallback do lokalnych obrazów
            setImages(bikesDataFallback.bikes.map(b => b.image));
          }
        } else {
          setImages(bikesDataFallback.bikes.map(b => b.image));
        }
      } catch (error) {
        console.error('Błąd pobierania galerii:', error);
        setImages(bikesDataFallback.bikes.map(b => b.image));
      } finally {
        setLoading(false);
      }
    }
    
    fetchImages();
  }, []);

  // Funkcja do poprawnego URL obrazu
  function getImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Zobacz nasze motocykle
            </h2>
            <p className="text-lg text-gray-medium">Ładowanie galerii...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Zobacz nasze motocykle
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Przeglądaj zdjęcia naszych motocykli
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={getImageUrl(image)}
                alt={`Motocykl ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={image.startsWith('http')}
              />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={getImageUrl(selectedImage)}
                alt="Wybrane zdjęcie"
                width={1200}
                height={800}
                className="object-contain max-h-[90vh]"
                unoptimized={selectedImage.startsWith('http')}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
