import { lifecycleEnum } from '../supabase/supabase-lifecycle.interface';
import { LifecycleOption } from '../supabase/DTO';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface LifecycleTypeIdMap {
  [key: string]: lifecycleEnum;
}

export interface LifecycleMetadataState extends StateMediaBookmark {
  lifecycleOptions: LifecycleOption[];
  lifecycleTypeIdMap: LifecycleTypeIdMap;
}
