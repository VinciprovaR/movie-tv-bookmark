import { TVResult } from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface SearchTVState extends StateMediaBookmark {
  query: string;
  tvResult: TVResult;
}
