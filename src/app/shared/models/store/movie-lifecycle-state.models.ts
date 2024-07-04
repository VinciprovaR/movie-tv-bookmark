import { ErrorResponse } from '../error.models';
import { lifeCycleId } from '../lifecycle.models';
import { MediaType } from '../media.models';

export interface MovieLifecycleMap {
  type: MediaType;
  [key: number]: lifeCycleId;
}
export interface MovieLifecycleState {
  isLoading: boolean;
  error: ErrorResponse | null;
  movieLifecycleMap: MovieLifecycleMap;
}
