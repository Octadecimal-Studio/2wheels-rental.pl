/**
 * Klient API Strapi dla 2Wheels Rental
 * Pobiera dane z CMS: https://2wheels-cms.octadecimal.studio
 */

// URL do CMS - pobierane z env lub domyślne
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://2wheels-cms.octadecimal.studio';

// Typy danych
export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    small?: { url: string; width: number; height: number };
    thumbnail?: { url: string; width: number; height: number };
  };
}

export interface StrapiBike {
  id: number;
  documentId: string;
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
  image: StrapiImage | null;
}

export interface StrapiTestimonial {
  id: number;
  authorName: string;
  content: string;
  rating: number;
  order?: number;
}

export interface StrapiSiteSettings {
  id: number;
  siteTitle: string;
  siteDescription: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  openingHours: string;
  mapCoordinates?: string;
}

export interface ReservationData {
  bikeId: number;
  bikeName: string;
  pickupDate: string;
  returnDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status?: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Pobiera pełny URL obrazu ze Strapi
 */
export function getStrapiMediaUrl(image: StrapiImage | null): string {
  if (!image) return '/img/bikes/bike-adventure-1.jpg'; // Placeholder
  
  // Jeśli URL zaczyna się od http, zwróć bez zmian
  if (image.url.startsWith('http')) return image.url;
  
  // W przeciwnym razie dodaj bazowy URL Strapi
  return `${STRAPI_URL}${image.url}`;
}

/**
 * Wykonuje zapytanie do API Strapi
 */
async function fetchStrapi<T>(endpoint: string, options?: RequestInit): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 60 }, // ISR - cache przez 60 sekund
      ...options,
    });

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      throw new Error(`Strapi API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

/**
 * Pobiera wszystkie motocykle z CMS
 */
export async function getBikes(): Promise<StrapiBike[]> {
  try {
    const response = await fetchStrapi<StrapiBike[]>('/bikes?populate=*&sort=price:asc');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching bikes:', error);
    return [];
  }
}

/**
 * Pobiera motocykl po ID
 */
export async function getBikeById(id: number): Promise<StrapiBike | null> {
  try {
    const response = await fetchStrapi<StrapiBike>(`/bikes/${id}?populate=*`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching bike:', error);
    return null;
  }
}

/**
 * Pobiera opinie klientów
 */
export async function getTestimonials(): Promise<StrapiTestimonial[]> {
  try {
    const response = await fetchStrapi<StrapiTestimonial[]>('/testimonials?populate=*&sort=order:asc');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Pobiera ustawienia strony
 */
export async function getSiteSettings(): Promise<StrapiSiteSettings | null> {
  try {
    const response = await fetchStrapi<StrapiSiteSettings>('/site-setting?populate=*');
    return response.data || null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

/**
 * Konwertuje dane z CMS do formatu używanego w komponentach
 */
export function formatBikeFromCMS(bike: StrapiBike) {
  return {
    id: bike.id,
    name: bike.name,
    brand: bike.brand,
    category: bike.category,
    price: bike.price,
    priceWeek: bike.priceWeek,
    priceMonth: bike.priceMonth,
    capacity: bike.capacity,
    year: bike.year,
    available: bike.available,
    description: bike.description,
    specs: bike.specs,
    image: getStrapiMediaUrl(bike.image),
  };
}

/**
 * Tworzy rezerwację w CMS
 */
export async function createReservation(data: ReservationData): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          // Pola zgodne ze schematem Strapi Reservation
          pickupDate: data.pickupDate,
          returnDate: data.returnDate,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          notes: data.notes ? `[${data.bikeName}] ${data.notes}` : `Rezerwacja: ${data.bikeName}`,
          status: data.status || 'pending',
          rodoConsent: true,
        }
      }),
    });

    const result = await response.json();
    
    if (result.data) {
      return { success: true, id: result.data.id };
    } else {
      console.error('Strapi error:', result.error);
      return { success: false, error: result.error?.message || 'Błąd zapisu rezerwacji' };
    }
  } catch (error) {
    console.error('Error creating reservation:', error);
    return { success: false, error: 'Błąd połączenia z serwerem' };
  }
}
