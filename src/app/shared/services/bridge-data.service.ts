import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaLifecycleDTO } from '../interfaces/supabase/DTO';
import {
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../interfaces/lifecycle.interface';
import { Movie_Life_Cycle } from '../interfaces/supabase/entities/movie_life_cycle.entity.interface';
import { Movie_Data } from '../interfaces/supabase/entities/movie_data.entity.interface';
import { TV_Data } from '../interfaces/supabase/entities/tv_data.entity.interface';

//to-do refractor with signals?
@Injectable()
export class BridgeDataService {
  //mediaLifecycleMap
  private readonly mediaLifecycleMap$ = new BehaviorSubject<
    MovieLifecycleMap | TVLifecycleMap
  >({});
  readonly mediaLifecycleMapObs$: Observable<
    MovieLifecycleMap | TVLifecycleMap
  > = this.mediaLifecycleMap$.asObservable();

  //inputLifecycleOptions
  private readonly inputLifecycleOptions$ = new Subject<MediaLifecycleDTO>();
  readonly inputLifecycleOptionsObs$: Observable<MediaLifecycleDTO> =
    this.inputLifecycleOptions$.asObservable();

  //lifecycleTypeSearch
  private readonly lifecycleTypeSearch$ = new Subject<string>();
  readonly lifecycleTypeSearchObs$: Observable<string> =
    this.lifecycleTypeSearch$.asObservable();

  //mediaListResultByLifecycle
  private readonly mediaListResultByLifecycle$ = new Subject<
    Movie_Data[] | TV_Data[]
  >();
  readonly mediaListResultByLifecycleObs$: Observable<
    Movie_Data[] | TV_Data[]
  > = this.mediaListResultByLifecycle$.asObservable();

  constructor() {}

  pushInputLifecycleOptions(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.inputLifecycleOptions$.next(mediaLifecycleDTO);
  }

  pushMediaLifecycleMap(mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap) {
    this.mediaLifecycleMap$.next(mediaLifecycleMap);
  }

  pushLifecycleTypeSearch(lifecycleType: string) {
    this.lifecycleTypeSearch$.next(lifecycleType);
  }

  pushMediaListResultByLifecycle(
    mediaListResultByLifecycle: Movie_Data[] | TV_Data[]
  ) {
    this.mediaListResultByLifecycle$.next(mediaListResultByLifecycle);
  }
}
