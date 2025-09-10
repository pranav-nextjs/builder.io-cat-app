"use client";
import Image from "next/image";
import Link from "next/link";
import { Cat } from "@/types/cat";
import { useSearchParams } from "next/navigation";

interface CatCardProps {
  cat: Cat;
}

export default function CatCard({ cat }: CatCardProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || "0";
  const currentSort = searchParams.get("sort") || "rand";
  const breedId = searchParams.get('breed') || '';

  const hasImage = Boolean(cat.url && cat.url.trim().length > 0);
  const isGif = hasImage && cat.url.toLowerCase().endsWith(".gif");

  const href = `/details/${encodeURIComponent(cat.id)}?page=${encodeURIComponent(currentPage
  )}&sort=${encodeURIComponent(currentSort)}&breed=${encodeURIComponent(breedId)}`;

  const breed = cat.breeds && cat.breeds.length > 0 ? cat.breeds[0] : null;

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="relative h-64 w-full bg-gray-100 flex items-center justify-center">
          {hasImage ? (
            <Image
              src={cat.url}
              alt={breed?.name || "Cat"}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={isGif}
            />
          ) : (
            // Placeholder when there is no image URL
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15V8a2 2 0 0 0-2-2h-2l-1-2H8L7 6H5a2 2 0 0 0-2 2v9" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-sm">No image available</div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">
            {breed?.name || "Unknown Breed"}
          </h3>
          <p className="text-gray-600 text-sm min-h-[2.8rem] line-clamp-2">
            {breed?.description || "No description available"}
          </p>
        </div>
      </div>
    </Link>
  );
}