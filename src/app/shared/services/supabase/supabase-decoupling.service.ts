import { Injectable } from '@angular/core';
import { SelectLifecycleDTO } from '../../models/supabase/DTO';
import {
  Media_Lifecycle_Options,
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../models/supabase/entities';
import { MovieLifecycleMap } from '../../models/store/movie-lifecycle-state.models';
import { TVLifecycleMap } from '../../models/store/tv-lifecycle-state.models';
import { lifeCycleId } from '../../models/lifecycle.models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDecouplingService {
  constructor() {}

  fromMediaLifecycleOptionsToSelectLifecycleDTO(
    mediaLifecycleOptions: Media_Lifecycle_Options[]
  ): SelectLifecycleDTO[] {
    return mediaLifecycleOptions.map((lc) => {
      return { label: lc.label, value: lc.id as lifeCycleId };
    });
  }

  fromEntityMovieLifecycleListToMovieLifecycleMap(
    entityMovieLifeCycleList: Movie_Life_Cycle[],
    movieLifecycleMap: MovieLifecycleMap
  ): MovieLifecycleMap {
    entityMovieLifeCycleList.forEach((entityMovieLifeCycle) => {
      movieLifecycleMap[entityMovieLifeCycle.movie_id] =
        entityMovieLifeCycle.lifecycle_id;
    });
    return movieLifecycleMap;
  }

  fromEntityTVLifecycleListToTVLifecycleMap(
    entityTVLifeCycleList: TV_Life_Cycle[],
    tvLifecycleMap: TVLifecycleMap
  ): TVLifecycleMap {
    entityTVLifeCycleList.forEach((entityTVLifeCycle) => {
      tvLifecycleMap[entityTVLifeCycle.tv_id] = entityTVLifeCycle.lifecycle_id;
    });

    return tvLifecycleMap;
  }
}
