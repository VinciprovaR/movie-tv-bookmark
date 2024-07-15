import { User } from '@supabase/supabase-js';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface AuthState extends StateMediaBookmark {
  user: User | null;
}
