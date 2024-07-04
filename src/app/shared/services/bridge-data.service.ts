import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaLifecycleDTO, SelectLifecycleDTO } from '../models/supabase/DTO';
import { MovieLifecycleMap } from '../models/store/movie-lifecycle-state.models';
import { TVLifecycleMap } from '../models/store/tv-lifecycle-state.models';

//to-do refractor with signals?
@Injectable()
export class BridgeDataService {
  //selectLifecycleOptions
  private readonly selectLifecycleOptions$ = new BehaviorSubject<
    SelectLifecycleDTO[] | []
  >([]);
  readonly selectLifecycleOptionsObs$: Observable<SelectLifecycleDTO[] | []> =
    this.selectLifecycleOptions$.asObservable();

  //mediaLifecycleMap
  private readonly mediaLifecycleMap$ = new BehaviorSubject<
    MovieLifecycleMap | TVLifecycleMap | null
  >(null);
  readonly mediaLifecycleMapObs$: Observable<
    MovieLifecycleMap | TVLifecycleMap | null
  > = this.mediaLifecycleMap$.asObservable();

  //inputLifecycleOptions
  private readonly inputLifecycleOptions$ = new Subject<MediaLifecycleDTO>();
  readonly inputLifecycleOptionsObs$: Observable<MediaLifecycleDTO> =
    this.inputLifecycleOptions$.asObservable();

  constructor() {}

  pushSelectLifecycleOptions(lifecycleOptions: SelectLifecycleDTO[]) {
    this.selectLifecycleOptions$.next(lifecycleOptions);
  }

  pushInputLifecycleOptions(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.inputLifecycleOptions$.next(mediaLifecycleDTO);
  }

  pushMediaLifecycleMap(mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap) {
    this.mediaLifecycleMap$.next(mediaLifecycleMap);
  }
}
