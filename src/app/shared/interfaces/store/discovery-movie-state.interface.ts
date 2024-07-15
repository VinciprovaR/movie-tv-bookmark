import { MovieResult, MovieDetail } from '../TMDB/tmdb-media.interface';
import { Certification, Genre, Language } from '../TMDB/tmdb-filters.interface';
import { DateRange } from './discovery-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

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

export interface DiscoveryMovieState extends StateMediaBookmark {
  payload: PayloadDiscoveryMovie;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}
