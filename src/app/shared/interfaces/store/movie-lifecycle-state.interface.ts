import { Movie_Data } from '../supabase/entities';
import { MovieLifecycleMap } from '../supabase/supabase-lifecycle.interface';
import { PayloadMediaLifecycle } from './media-lifecycle-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface MovieLifecycleState extends StateMediaBookmark {
  movieLifecycleMap: MovieLifecycleMap;
  movieList: Movie_Data[];
  updateSearch: boolean;
  payload: PayloadMediaLifecycle;
}
