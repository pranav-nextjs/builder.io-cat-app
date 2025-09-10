import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Breed } from "@/types/cat";

const API_URL = process.env.CAT_API_URL;

export const revalidate = 3600;

export default async function BreedsPage() {
  let breeds: Breed[] = [];

  try {
    const res = await fetch(`${API_URL}/breeds`, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY || "",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch breeds: ${res.status} ${res.statusText}`);
    }

    breeds = await res.json();
  } catch (err) {
    console.error("Failed to load breeds directly:", err);
    breeds = [];
  }

  if (breeds.length === 0) {
    return (
      <div className="py-12 text-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-2">Breeds</h1>
        <p>Couldn’t load breed information. Please try again later.</p>
        <p className="text-sm text-gray-500">Browse cat breeds and their traits</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Breeds</h1>
        <p className="text-sm text-gray-500">Browse cat breeds and their traits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {breeds.map((b) => (
          <article
            key={b.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition flex flex-col"
          >
            <div className="p-2">
              <Link
                href={`/?breed=${encodeURIComponent(b.id)}&page=0`}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 transition"
              >
                <Eye size={14} strokeWidth={2} />
                View in Gallery
              </Link>
            </div>

            <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden relative">
              {b.reference_image_id ? (
                <Image
                  src={`https://cdn2.thecatapi.com/images/${b.reference_image_id}.jpg`}
                  alt={b.name}
                  fill
                  className="object-contain p-2" 
                  sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw"
                  unoptimized={b.reference_image_id
                    .toLowerCase()
                    .endsWith(".gif")}
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h2 className="font-semibold text-lg">{b.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                {b.temperament ||
                  b.description ||
                  "No description available."}
              </p>

              <div className="mt-4 text-xs text-gray-500">
                {b.origin && <span>Origin: {b.origin}</span>}
                {b.life_span && (
                  <span className="ml-2">• Lifespan: {b.life_span}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
