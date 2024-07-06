import { ErrorResponse } from '../error.interface';
import { lifeCycleId } from '../lifecycle.interface';
import { MediaType } from '../media.interface';

export interface TVLifecycleMap {
  type: MediaType;
  [key: number]: lifeCycleId;
}
export interface TVLifecycleState {
  isLoading: boolean;

  error: ErrorResponse | null;
  tvLifecycleMap: TVLifecycleMap;
}
