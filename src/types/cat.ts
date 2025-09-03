export interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Breed[];
}

export interface Breed {
  id: string;
  name: string;
  description: string;
  origin: string;
  temperament: string;
  life_span: string;
}

export interface CatResponse {
  cats: Cat[],
  totalPages: number
}

export type SortOrder = 'rand' | 'asc' | 'desc';