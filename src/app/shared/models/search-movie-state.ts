import { ErrorResponse } from './auth-models';
import { MovieResult, MovieDetail } from './search-movie.models';

export interface SearchMovieState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  movieDetail: MovieDetail | {};
}
