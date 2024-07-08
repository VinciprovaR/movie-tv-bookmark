import { ErrorResponse } from '../error.interface';
import { MediaLifecycleMap } from '../lifecycle.interface';

export interface TVLifecycleState {
  isLoading: boolean;
  error: ErrorResponse | null;
  tvLifecycleMap: MediaLifecycleMap;
}
