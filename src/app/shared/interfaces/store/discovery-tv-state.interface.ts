import { TVResult, TVDetail } from '../TMDB/tmdb-media.interface';
import { Genre, Language } from '../TMDB/tmdb-filters.interface';
import { DateRange, VoteAverage } from './discovery-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadDiscoveryTV {
  genreIdList: number[];
  sortBy: string;
  includeMediaWithLifecycle: boolean;
  language: string;
  voteAverage: VoteAverage;
  airDate: DateRange;
  allEpisode: boolean;
}

export interface DiscoveryTVState extends StateMediaBookmark {
  payload: PayloadDiscoveryTV;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}
