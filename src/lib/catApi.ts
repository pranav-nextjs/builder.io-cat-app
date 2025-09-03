import { Cat, CatResponse } from '@/types/cat';

const API_KEY = process.env.NEXT_PUBLIC_CAT_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_CAT_API_URL;

export const catApi = {

  getCats: async (page: number = 0, limit: number = 15, order: string = 'rand'): Promise<CatResponse> => {
    const urlWithParams = `${API_URL}/images/search?limit=${limit}&page=${page}&order=${order}`;
    const response = await fetch(urlWithParams, {
      headers: {
        'x-api-key': API_KEY || '',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cats: ${response.statusText}`);
    }
    const totalPages = Math.ceil(parseInt(response.headers.get('pagination-count') || '0', 10) / limit);
    const cats = await response.json();

    return { cats, totalPages };
  },

  getCatById: async (id: string): Promise<Cat> => {
    const response = await fetch(`${API_URL}/images/${id}`, {
      headers: {
        'x-api-key': API_KEY || '',
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cat details: ${response.statusText}`);
    }

    return response.json();
  }
}