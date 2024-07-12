import { lifeCycleId, MovieLifecycleMap } from '../lifecycle.interface';
import { LifecycleOption } from '../supabase/DTO';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface LifecycleTypeIdMap {
  [key: string]: lifeCycleId;
}

export interface LifecycleMetadataState extends StateMovieBookmark {
  lifecycleOptions: LifecycleOption[];
  lifecycleTypeIdMap: LifecycleTypeIdMap;
}
