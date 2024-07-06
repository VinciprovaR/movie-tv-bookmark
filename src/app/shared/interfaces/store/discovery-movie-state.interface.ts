import { ErrorResponse } from '../error.interface';
import { MovieResult, PeopleResult, MovieDetail } from '../media.interface';
import { SelectLifecycleDTO } from '../supabase/DTO';
import {
  Certification,
  Certifications,
  Genre,
} from '../tmdb-filters.interface';

export interface ReleaseDate {
  from: string;
  to: string;
}

export interface PayloadDiscoveryMovie {
  genreIdList: number[];
  sortBy: string;
  releaseDate: ReleaseDate;
  includeMediaWithLifecycle: boolean;
  certification: string;
}

export interface DiscoveryMovieState {
  isLoading: boolean;
  payload: PayloadDiscoveryMovie;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  peopleResult: PeopleResult;
  movieDetail: MovieDetail | null;
  genreList: Genre[];
  certifications: Certification[];
}
