import { Cat } from '@/types/cat';
import CatDetails from '@/components/CatDetails';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

interface DetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sort?: string; breed?: string }>;
}

export default async function DetailsPage({ params, searchParams }: DetailsPageProps) {
  const { id } = await params;
  const { page, sort, breed } = await searchParams;

  let cat: Cat | null = null;
  try {
    const res = await fetch(`${APP_URL}/api/thecat/images/${id}`, { cache: 'no-store' });
    if (res.ok) {
      cat = await res.json();
    }
  } catch (error) {
    console.error('Error loading cat details:', error);
  }

  return (
    <CatDetails
      cat={cat}
      returnPage={page || '0'}
      returnSort={sort || 'rand'}
      returnBreed={breed}
    />
  );
}
