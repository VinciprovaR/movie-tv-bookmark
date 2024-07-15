import { TVResult, TVDetail } from '../TMDB/tmdb-media.interface';
import { Genre, Language } from '../TMDB/tmdb-filters.interface';
import { VoteAverage } from './discovery-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

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

export interface DiscoveryTVState extends StateMediaBookmark {
  payload: PayloadDiscoveryTV;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}
