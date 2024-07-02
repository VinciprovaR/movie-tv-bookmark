import { ErrorResponse } from '../error.models';
import { MovieResult, PeopleResult, MovieDetail } from '../media.models';
import { SelectLifecycleDTO } from '../supabase/DTO';
import { Genre } from '../tmdb-filters.models';

export interface ReleaseDate {
  from: string;
  to: string;
}

export interface PayloadDiscoveryMovie {
  genreIdList: number[];
  sortBy: string;
  releaseDate: ReleaseDate;
  includeLifecycle: boolean;
}

export interface DiscoveryMovieState {
  isLoading: boolean;
  payload: PayloadDiscoveryMovie;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  peopleResult: PeopleResult;
  movieDetail: MovieDetail | null;
  genreList: Genre[] | [];
}
