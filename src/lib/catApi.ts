import {
  Cat,
  CatResponse,
  Breed,
  Favourite,
  VoteResponse,
  UploadResponse,
} from "@/types/cat";

const API_URL = "/api/thecat";

export const catApi = {
  async getCats(
    page = 0,
    limit = 15,
    order: string = "rand",
    breedId?: string
  ): Promise<CatResponse> {
    const params = new URLSearchParams({ limit: String(limit), page: String(page), order });
    if (breedId) params.set("breed_ids", breedId);

    const res = await fetch(`${API_URL}/images/search?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch cats: ${res.statusText}`);

    const totalPages = Math.ceil(parseInt(res.headers.get('pagination-count') || '0', 10) / limit);
    const cats: Cat[] = await res.json();

    return { cats, totalPages };
  },

  async getCatById(id: string): Promise<Cat> {
    const res = await fetch(`${API_URL}/images/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch cat details: ${res.statusText}`);
    return res.json();
  },

  async getBreeds(): Promise<Breed[]> {
    const res = await fetch(`${API_URL}/breeds`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch breeds: ${res.statusText}`);
    return res.json();
  },

  async getFavourites(sub_id?: string): Promise<Favourite[]> {
    const q = sub_id ? `?sub_id=${encodeURIComponent(sub_id)}` : "";
    const res = await fetch(`${API_URL}/favourites${q}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch favourites: ${res.statusText}`);
    return res.json();
  },

  async addFavourite(image_id: string, sub_id?: string): Promise<{ message: string; id?: number }> {
    const res = await fetch(`${API_URL}/favourites`, {
      method: "POST",
      body: JSON.stringify({ image_id, sub_id }),
    });
    if (!res.ok) throw new Error(`Failed to add favourite: ${res.statusText}`);
    return res.json();
  },

  async deleteFavourite(favourite_id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/favourites/${favourite_id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete favourite: ${res.statusText}`);
    return res.json();
  },

  async vote(image_id: string, value: 1 | 0, sub_id?: string): Promise<VoteResponse> {
    const res = await fetch(`${API_URL}/votes`, {
      method: "POST",
      body: JSON.stringify({ image_id, value, sub_id }),
    });
    if (!res.ok) throw new Error(`Failed to vote: ${res.statusText}`);
    return res.json();
  },

  async upload(file: File, sub_id?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (sub_id) formData.append("sub_id", sub_id);

    const res = await fetch(`${API_URL}/images/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload image: ${res.statusText}`);
    return res.json();
  },
};
