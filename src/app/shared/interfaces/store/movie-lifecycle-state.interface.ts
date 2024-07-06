import { ErrorResponse } from '../error.interface';
import { lifeCycleId } from '../lifecycle.interface';
import { MediaType } from '../media.interface';

export interface MovieLifecycleMap {
  type: MediaType;
  [key: number]: lifeCycleId;
}
export interface MovieLifecycleState {
  isLoading: boolean;
  error: ErrorResponse | null;
  movieLifecycleMap: MovieLifecycleMap;
}
