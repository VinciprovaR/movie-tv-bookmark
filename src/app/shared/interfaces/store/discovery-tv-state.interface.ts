import { TVResult, TVDetail } from '../media.interface';
import { Genre, Language } from '../tmdb-filters.interface';
import { VoteAverage } from './discovery-state.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface AirDate {
  from: string;
  to: string;
}

export interface PayloadDiscoveryTV {
  genreIdList: number[];
  sortBy: string;
  includeMediaWithLifecycle: boolean;
  language: string;
  voteAverage: VoteAverage;
  airDate: AirDate;
  allEpisode: boolean;
}

export interface DiscoveryTVState extends StateMovieBookmark {
  payload: PayloadDiscoveryTV;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
  genreList: Genre[];
  languageList: Language[];
}
