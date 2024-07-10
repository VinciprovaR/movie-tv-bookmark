import { MovieLifecycleMap } from '../lifecycle.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface MovieLifecycleState extends StateMovieBookmark {
  movieLifecycleMap: MovieLifecycleMap;
}
