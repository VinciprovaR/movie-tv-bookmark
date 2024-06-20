export interface Movie_Life_Cycle {
  id?: number;
  created_at?: string;
  user_id?: string;
  movie_id: number;
  lifecycle_id?: number;
}

export interface Lifecycle_Enum {
  id: number;
  enum: string;
  description: string;
  label: string;
}
