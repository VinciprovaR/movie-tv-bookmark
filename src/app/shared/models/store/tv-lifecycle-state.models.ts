import { ErrorResponse } from '../error.models';
import { lifeCycleId } from '../lifecycle.models';
import { MediaType } from '../media.models';

export interface TVLifecycleMap {
  type: MediaType;
  [key: number]: lifeCycleId;
}
export interface TVLifecycleState {
  isLoading: boolean;

  error: ErrorResponse | null;
  tvLifecycleMap: TVLifecycleMap;
}
