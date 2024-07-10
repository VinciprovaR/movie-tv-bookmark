import { TVLifecycleMap } from '../lifecycle.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface TVLifecycleState extends StateMovieBookmark {
  tvLifecycleMap: TVLifecycleMap;
}
