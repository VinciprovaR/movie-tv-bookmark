import { MovieResult } from '../TMDB/tmdb-media.interface';
import { DateRange, VoteAverage } from './discovery-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

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
}
