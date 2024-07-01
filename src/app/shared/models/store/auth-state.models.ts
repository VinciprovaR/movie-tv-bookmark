import { User } from '@supabase/supabase-js';
import { ErrorResponse } from '../error.models';

export interface AuthState {
  isLoading: boolean;
  error: ErrorResponse | null;
  user: User | null;
}
