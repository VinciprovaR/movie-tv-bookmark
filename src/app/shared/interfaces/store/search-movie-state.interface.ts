import { ErrorResponse } from '../error.interface';
import { MovieResult, MovieDetail } from '../media.interface';

export interface SearchMovieState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}
