import { ErrorResponse } from '../error.interface';

export interface StateMovieBookmark {
  isLoading: boolean;
  error: ErrorResponse | null;
}
