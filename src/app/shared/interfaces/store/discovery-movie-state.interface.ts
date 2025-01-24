import { MovieResult } from '../TMDB/tmdb-media.interface';
import { DateRange, VoteAverage } from './discovery-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadDiscoveryMovie {
  genreIdList: number[];
  sortBy: string;
  includeMediaWithBookmark: boolean;
  language: string;
  voteAverage: VoteAverage;
  minVote: number;
  releaseDate: DateRange;
  certification: string;
}

export interface DiscoveryMovieState extends StateMediaBookmark {
  payload: PayloadDiscoveryMovie;
  movieResult: MovieResult;
  noAdditional: boolean;
  isFirstLanding: boolean;
  infiniteScrollDisabled: boolean;
}
