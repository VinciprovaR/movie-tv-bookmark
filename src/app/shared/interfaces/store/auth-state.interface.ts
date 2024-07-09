import { User } from '@supabase/supabase-js';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface AuthState extends StateMovieBookmark {
  user: User | null;
}
