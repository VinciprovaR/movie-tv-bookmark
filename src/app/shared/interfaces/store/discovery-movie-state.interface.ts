import { MovieResult, MovieDetail } from '../media.interface';
import { Certification, Genre, Language } from '../tmdb-filters.interface';
import { DateRange } from './discovery-state.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface VoteAverage {
  voteAverageMin: number;
  voteAverageMax: number;
}

export interface PayloadDiscoveryMovie {
  genreIdList: number[];
  sortBy: string;
  includeMediaWithLifecycle: boolean;
  language: string;
  voteAverage: VoteAverage;
  releaseDate: DateRange;
  certification: string;
}

export interface DiscoveryMovieState extends StateMovieBookmark {
  payload: PayloadDiscoveryMovie;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
  genreList: Genre[];
  certificationList: Certification[];
  languageList: Language[];
}
