import { TV_Data } from '../supabase/entities';
import { TVLifecycleMap } from '../supabase/supabase-lifecycle.interface';
import { PayloadMediaLifecycle } from './media-lifecycle-state.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface TVLifecycleState extends StateMediaBookmark {
  tvLifecycleMap: TVLifecycleMap;
  tvList: TV_Data[];
  updateSearch: boolean;
  payload: PayloadMediaLifecycle;
}
