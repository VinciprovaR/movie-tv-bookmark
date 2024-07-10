import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaLifecycleDTO } from '../interfaces/supabase/DTO';
import {
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../interfaces/lifecycle.interface';

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

  constructor() {}

  pushInputLifecycleOptions(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.inputLifecycleOptions$.next(mediaLifecycleDTO);
  }

  pushMediaLifecycleMap(mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap) {
    this.mediaLifecycleMap$.next(mediaLifecycleMap);
  }
}
