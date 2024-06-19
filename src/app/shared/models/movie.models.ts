import { Media, MediaDetail, MediaResult } from './media.models';
import { ErrorResponse } from './auth.models';

export interface SearchMovieState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}

export interface Movie extends Media {}

export interface MovieResult extends MediaResult {
  results: Movie[] | [];
}

export interface MovieDetail extends MediaDetail {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  imdb_id: string;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
}

export type noLifecycle = 0;
export type watchListLifecycle = 1;
export type watchedLifecycle = 2;
export type rewatchLifecycle = 3;

export type lifeCycleId =
  | noLifecycle
  | watchListLifecycle
  | watchedLifecycle
  | rewatchLifecycle;

export interface MovieLifecycle {
  movieId: number;
  lifecycleId: number;
  index: number;
}
