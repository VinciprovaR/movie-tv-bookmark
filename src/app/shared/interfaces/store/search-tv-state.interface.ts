import { TVResult, TVDetail } from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface SearchTVState extends StateMediaBookmark {
  query: string;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}
