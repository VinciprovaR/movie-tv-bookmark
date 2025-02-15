import { TVResult } from '../TMDB/tmdb-media.interface';
import { DateRange, VoteAverage } from './discovery-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadDiscoveryTV {
  genreIdList: number[];
  sortBy: string;
  includeMediaWithBookmark: boolean;
  language: string;
  voteAverage: VoteAverage;
  minVote: number;
  airDate: DateRange;
  allEpisode: boolean;
}

export interface DiscoveryTVState extends StateMediaBookmark {
  payload: PayloadDiscoveryTV;
  tvResult: TVResult;
  noAdditional: boolean;
  isfirstLanding: boolean;
  infiniteScrollDisabled: boolean;
}
