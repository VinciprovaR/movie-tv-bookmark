import { ErrorResponse } from '../error.models';
import { TVResult, TVDetail } from '../media.models';
import { SelectLifecycleDTO } from '../supabase/DTO';

export interface SearchTVState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}
