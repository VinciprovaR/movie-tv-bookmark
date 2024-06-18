import { ErrorResponse } from './auth.models';

export interface MovieLifecycleState {
  isLoading: boolean;
  error: ErrorResponse | null;
}
