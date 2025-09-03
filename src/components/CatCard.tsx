import Image from "next/image";
import Link from "next/link";
import { Cat } from "@/types/cat";
import { useSearchParams } from "next/navigation";

interface CatCardProps {
  cat: Cat;
}

export default function CatCard({ cat }: CatCardProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '0';
  const currentSort = searchParams.get('sort') || 'random';
  return (
    <Link href={`/details/${cat.id}?page=${currentPage}&sort=${currentSort}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="relative h-64 w-full bg-gray-100 flex items-center justify-center">
          <Image
            src={cat.url}
            alt={cat.breeds?.[0]?.name || 'Cat'}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">
            {cat.breeds?.[0]?.name || 'Unknown Breed'}
          </h3>
          <p className="text-gray-600 text-sm min-h-[2.8rem] line-clamp-2">
            {cat.breeds?.[0]?.description || 'No description available'}
          </p>
        </div>
      </div>
    </Link>
  );
}