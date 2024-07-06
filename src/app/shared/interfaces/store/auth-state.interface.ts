import { User } from '@supabase/supabase-js';
import { ErrorResponse } from '../error.interface';

export interface AuthState {
  isLoading: boolean;
  error: ErrorResponse | null;
  user: User | null;
}
