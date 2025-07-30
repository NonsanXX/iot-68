export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  synopsis?: string;
  publishedAt: string;
  genreId?: number;
}

export interface Genre {
  id: number;
  title: string;
}
