// src/app/favourites/page.tsx
import { catApi } from "@/lib/catApi";
import CatCard from "@/components/CatCard";
import { Breed, Cat, Favourite } from "@/types/cat";

export const revalidate = 30;

export default async function FavouritesPage() {
  let favs: Favourite[] = [];

  try {
    favs = await catApi.getFavourites("my-user-1234");
  } catch {
    try {
      const res = await fetch(
        `${process.env.CAT_API_URL || "https://api.thecatapi.com/v1"}/favourites?sub_id=my-user-1234`,
        {
          headers: { "x-api-key": process.env.CAT_API_KEY || "" },
          cache: "no-store",
        }
      );
      if (res.ok) favs = await res.json();
    } catch {
      favs = [];
    }
  }

  // Normalize favourites into Cat[].
  // If image.url is missing we set url to empty string (CatCard will render placeholder).
  const cats: Cat[] = favs.map((f) => {
    const img = f.image ?? undefined;
    return {
      id: (img?.id as string) || f.image_id || String(f.id),
      url: (img?.url as string) ?? "",
      width: (img?.width as number) ?? 0,
      height: (img?.height as number) ?? 0,
      breeds: (img?.breeds as Breed[]) ?? [],
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Favourites</h1>
        <p className="text-sm text-gray-500">Your saved cat images</p>
      </div>

      {cats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No favourites yet.</p>
      )}
    </div>
  );
}
