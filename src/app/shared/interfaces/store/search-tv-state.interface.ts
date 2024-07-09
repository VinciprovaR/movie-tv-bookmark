import { TVResult, TVDetail } from '../media.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface SearchTVState extends StateMovieBookmark {
  query: string;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}
