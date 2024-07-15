import { MovieResult, MovieDetail } from '../TMDB/tmdb-media.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface SearchMovieState extends StateMediaBookmark {
  query: string;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}
