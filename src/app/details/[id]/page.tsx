import { catApi } from '@/lib/catApi';
import { Cat } from '@/types/cat';
import CatDetails from '@/components/CatDetails';

interface DetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function DetailsPage({ params, searchParams }: DetailsPageProps) {
  const { id } = await params;
  const { page, sort } = await searchParams;
  let cat: Cat | null = null;

  try {
    cat = await catApi.getCatById(id);
  } catch (error) {
    console.error('Error loading cat details:', error);
  }

  return <CatDetails cat={cat} returnPage={page || '0'} returnSort={sort || 'random'} />;
}

export async function generateMetadata({ params }: DetailsPageProps) {
  const { id } = await params;
  try {
    const cat = await catApi.getCatById(id);
    return {
      title: `${cat.breeds?.[0]?.name || 'Cat'} Details`,
    };
  } catch {
    return {
      title: 'Cat Details',
    };
  }
}