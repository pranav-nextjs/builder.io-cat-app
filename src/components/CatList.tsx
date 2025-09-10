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
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
 
  const page = parseInt(searchParams.get('page') || '0');
  const sort = (searchParams.get('sort') || 'rand') as SortOrder;
  const breedId = searchParams.get('breed') || undefined;

  const loadCats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await catApi.getCats(page, ITEMS_PER_PAGE, sort.toUpperCase(), breedId);
      setCats(data.cats);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading cats:', error);
      setError('Failed to load cats. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, sort, breedId]);

  useEffect(() => {
      loadCats();
  }, [loadCats, page, totalPages]);

  const handleSortChange = (newSort: SortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    params.set('page', '0');
    if (breedId) params.set('breed', breedId);
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    if (breedId) params.set('breed', breedId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cat Gallery</h1>
          <div className="flex items-center gap-4">
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            )}
            <SortSelect value={sort} onChange={handleSortChange} />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error ? (
          <>
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
          </>
        ) : (
          !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}