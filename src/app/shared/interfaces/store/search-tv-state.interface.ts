import { ErrorResponse } from '../error.interface';
import { TVResult, TVDetail } from '../media.interface';
import { SelectLifecycleDTO } from '../supabase/DTO';

export interface SearchTVState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}
