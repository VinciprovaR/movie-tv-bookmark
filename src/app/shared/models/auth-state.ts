import { ErrorResponse } from './auth-models';
import { User } from '@supabase/supabase-js';

export interface AuthState {
  isLoading: boolean;
  error: ErrorResponse | null;
  user: User | null;
}
