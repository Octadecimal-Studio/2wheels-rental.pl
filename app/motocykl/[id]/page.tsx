import BikeDetailClient from './BikeDetailClient';

// Generowanie statycznych ścieżek dla wszystkich motocykli
// Lista ID motocykli - aktualizowana przy buildzie
export async function generateStaticParams() {
  // Statyczna lista ID motocykli z CMS 2Wheels
  // Aktualizowana przy buildzie na podstawie danych z https://2wheels-cms.octadecimal.studio/api/bikes
  const bikeIds = [15, 19, 21, 23, 25, 27, 29, 31, 33, 35];
  
  return bikeIds.map((id) => ({
    id: id.toString(),
  }));
}

interface BikePageProps {
  params: Promise<{ id: string }>;
}

export default async function BikePage({ params }: BikePageProps) {
  const { id } = await params;
  return <BikeDetailClient bikeId={id} />;
}
