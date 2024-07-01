import { Injectable } from '@angular/core';
import { Movie, MovieResult, TV, TVResult } from '../../models/media.models';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../models/supabase/DTO';
import {
  Media_Lifecycle_Options,
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../models/supabase/entities';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDecouplingService {
  constructor() {}

  injectUpdatedMovieLifecycle(
    entityMediaLifeCycle: Movie_Life_Cycle | null,
    movie: Movie
  ) {
    return this.injectUpdatedMediaLifecycle(
      entityMediaLifeCycle,
      movie,
      movie.id
    ) as Movie;
  }

  injectUpdatedTVLifecycle(entityMediaLifeCycle: TV_Life_Cycle, tv: TV) {
    return this.injectUpdatedMediaLifecycle(
      entityMediaLifeCycle,
      tv,
      tv.id
    ) as TV;
  }

  /**
   * Given the entity result from the CRUD operation, inject the lifecycle_id updated into the Media Result already fetched.
   *
   *
   * @param entityMediaLifeCycle - The entity result from the CRUD operation
   * @param media - The Movie or TV Objectalready fetched listed in the page, from the state
   * @returns List of Movie or TV with the lifecycle updated for the specific Movie or TV
   *
   * @beta
   */
  injectUpdatedMediaLifecycle(
    entityMediaLifeCycle: Movie_Life_Cycle | TV_Life_Cycle | null,
    media: Movie | TV,
    mediaId: number
  ): Movie | TV {
    let mediaClone = JSON.parse(JSON.stringify({ ...media }));

    if (mediaClone.id === mediaId) {
      mediaClone.lifecycleId = entityMediaLifeCycle?.lifecycle_id
        ? entityMediaLifeCycle.lifecycle_id
        : 0;
    } else {
      /*to-do problem, index not in synch with the actual object,
      do a binary search to find the movie id in all the objs of the state. If not found again, throw error
      */
    }

    return mediaClone;
  }

  fromLifecycleEntity(
    mediaLifecycleOptions: Media_Lifecycle_Options[]
  ): SelectLifecycleDTO[] {
    return mediaLifecycleOptions.map((lc) => {
      return { label: lc.label, value: lc.id };
    });
  }
}
