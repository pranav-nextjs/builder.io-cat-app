'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { catApi } from '@/lib/catApi';
import { Cat, SortOrder } from '@/types/cat';
import CatCard from './CatCard';
import SortSelect from './SortSelect';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 15;

export default function CatList() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = parseInt(searchParams.get('page') || '0');
  const sort = (searchParams.get('sort') || 'rand') as SortOrder;

    const loadCats = useCallback( async () => {
    try {
      setLoading(true);
      const data = await catApi.getCats(page, ITEMS_PER_PAGE, sort.toUpperCase());
      setCats(data.cats);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading cats:', error);
    } finally {
      setLoading(false);
    }
  }, [page, sort]);


  useEffect(() => {
    loadCats();
  }, [loadCats]);

  const handleSortChange = (newSort: SortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    params.set('page', '0');
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cat Gallery</h1>
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>

        {cats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cats found</p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}