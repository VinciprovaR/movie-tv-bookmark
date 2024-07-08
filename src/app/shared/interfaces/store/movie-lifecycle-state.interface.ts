import { ErrorResponse } from '../error.interface';
import { MediaLifecycleMap } from '../lifecycle.interface';

export interface MovieLifecycleState {
  isLoading: boolean;
  error: ErrorResponse | null;
  movieLifecycleMap: MediaLifecycleMap;
}
