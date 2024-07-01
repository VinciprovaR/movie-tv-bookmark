import { ErrorResponse } from '../error.models';
import { MovieResult, MovieDetail } from '../media.models';

export interface SearchMovieState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}
