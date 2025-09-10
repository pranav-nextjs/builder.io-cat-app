export interface Breed {
  id: string;
  name: string;
  description?: string;
  origin?: string;
  temperament?: string;
  life_span?: string;
  reference_image_id?: string;
  weight?: { metric?: string; imperial?: string };
  wikipedia_url?: string;
}

export interface Cat {
  id: string;
  url: string;
  width?: number;
  height?: number;
  breeds?: Breed[];
}

export interface CatResponse {
  cats: Cat[];
  totalPages: number;
}

export type SortOrder = "rand" | "asc" | "desc";

export interface Favourite {
  id: number;
  user_id: string;
  image_id: string;
  sub_id?: string;
  created_at: string;
  image?: {
    id?: string;
    url?: string;
    width?: number;
    height?: number;
    breeds?: Breed[];
  };
}


export interface Vote {
  id: number;
  image_id: string;
  sub_id?: string;
  value: 1 | 0;
  country_code?: string;
  created_at?: string;
}

export interface VoteResponse {
  message: string;
  id?: number;
}

export interface UploadResponse {
  id: string;
  url: string;
  pending: number;
  approved: number;
  original_filename?: string;
}
