import { ErrorResponse } from '../error.interface';
import { MovieResult, PeopleResult, MovieDetail } from '../media.interface';
import { LifecycleOption } from '../supabase/DTO';
import {
  Certification,
  Certifications,
  Genre,
  Language,
} from '../tmdb-filters.interface';

export interface ReleaseDate {
  from: string;
  to: string;
}

export interface VoteAverage {
  voteAverageMin: number;
  voteAverageMax: number;
}

export interface PayloadDiscoveryMovie {
  genreIdList: number[];
  sortBy: string;
  releaseDate: ReleaseDate;
  includeMediaWithLifecycle: boolean;
  certification: string;
  language: string;
  voteAverage: VoteAverage;
}

export interface DiscoveryMovieState {
  isLoading: boolean;
  payload: PayloadDiscoveryMovie;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  peopleResult: PeopleResult;
  movieDetail: MovieDetail | null;
  genreList: Genre[];
  certificationList: Certification[];
  languageList: Language[];
}
