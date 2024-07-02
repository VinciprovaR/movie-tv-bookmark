import { Injectable } from '@angular/core';
import {
  MediaResult,
  MediaType,
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../../models/media.models';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../models/supabase/DTO';
import {
  Media_Lifecycle_Options,
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../models/supabase/entities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDecouplingService {
  constructor() {}

  injectMovieLifecycle(
    entityMovieLifecycle: Movie_Life_Cycle[],
    movieResult: MovieResult,
    mediaType: MediaType,
    mediaIdMapIndex: { [key: string]: number }
  ): MovieResult {
    return this.injectMediaLifecycle(
      movieResult,
      entityMovieLifecycle,
      mediaType,
      mediaIdMapIndex
    ) as MovieResult;
  }

  injectTVLifecycle(
    entityTVLifecycle: TV_Life_Cycle[],
    tvResult: TVResult,
    mediaType: MediaType,
    mediaIdMapIndex: { [key: string]: number }
  ): TVResult {
    return this.injectMediaLifecycle(
      tvResult,
      entityTVLifecycle,
      mediaType,
      mediaIdMapIndex
    ) as TVResult;
  }

  private injectMediaLifecycle(
    mediaResult: MovieResult | TVResult,
    entityMediaLifecycle: Movie_Life_Cycle[] | TV_Life_Cycle[],
    mediaType: MediaType,
    mediaIdMapIndex: { [key: string]: number }
  ) {
    // console.log('movieLifecycle', movieLifecycle);
    // console.log('movieIdList', movieIdList);
    // console.log('movieIdMapIndex', movieIdMapIndex);
    entityMediaLifecycle.forEach((mlc: any) => {
      mediaResult.results[mediaIdMapIndex[mlc[`${mediaType}_id`]]][
        'lifecycleId'
      ] = mlc.lifecycle_id;
    });
    return mediaResult;
  }

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
      console.error(
        'mediaId selezionato non corrisponde con mediaId media state. Binary search... (?)'
      );
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
