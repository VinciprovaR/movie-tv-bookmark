import { ErrorResponse } from '../error.interface';

export interface StateMediaBookmark {
  isLoading: boolean;
  error: ErrorResponse | null;
}
