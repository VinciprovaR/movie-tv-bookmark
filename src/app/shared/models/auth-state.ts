import { ErrorResponse } from './auth-models';
import { User } from '@supabase/supabase-js';

export interface AuthState {
  isLoading: boolean;
  error: ErrorResponse | null;
  user: User | null;
}

// export interface User {
//   email: string;
//   jwtToken?: string;
//   username: string;
//   bio?: string;
//   image?: string;
// }
