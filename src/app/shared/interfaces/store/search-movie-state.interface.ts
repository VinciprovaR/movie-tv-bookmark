import { MovieResult, MovieDetail } from '../media.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface SearchMovieState extends StateMovieBookmark {
  query: string;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}
