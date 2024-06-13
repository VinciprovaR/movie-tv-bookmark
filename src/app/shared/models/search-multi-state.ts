import { ErrorResponse } from './auth-models';

export interface SearchMultiState {
  isLoading: boolean;
  error: ErrorResponse | null;
  movies: any;
  tvShow: any;
}
