'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Cat } from '@/types/cat';

interface CatDetailsProps {
  cat: Cat | null;
  returnPage?: string;
  returnSort?: string;
}

export default function CatDetails({ cat, returnPage = '0', returnSort = 'random' }: CatDetailsProps) {
  const returnUrl = `/?page=${returnPage}&sort=${returnSort}`;
  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cat not found</h1>
          <Link href={returnUrl} className="text-blue-500 hover:text-blue-700">
            Go back to gallery
          </Link>
        </div>
      </div>
    );
  }

  const breed = cat.breeds?.[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          href={returnUrl} 
          className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Gallery
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 w-full">
            <Image
              src={cat.url}
              alt={breed?.name || 'Cat'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {breed?.name || 'Unknown Breed'}
            </h1>

            {breed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {breed.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Details</h2>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Origin: </span>
                      <span className="text-gray-700">{breed.origin}</span>
                    </div>
                    <div>
                      <span className="font-medium">Temperament: </span>
                      <span className="text-gray-700">{breed.temperament}</span>
                    </div>
                    <div>
                      <span className="font-medium">Life Span: </span>
                      <span className="text-gray-700">{breed.life_span} years</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!breed && (
              <p className="text-gray-500">No breed information available for this cat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}