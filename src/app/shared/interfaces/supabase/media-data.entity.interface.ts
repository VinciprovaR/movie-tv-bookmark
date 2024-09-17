export interface MediaData {
  id: number;
  created_at?: string;
  poster_path: string;
  genre_ids: number[];
  overview: string;
}

export interface TVData extends MediaData {
  first_air_date: string;
  name: string;
}

export interface MovieData extends MediaData {
  release_date: string;
  title: string;
}
