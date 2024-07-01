import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaLifecycleDTO, SelectLifecycleDTO } from '../models/supabase/DTO';

@Injectable({
  providedIn: 'root',
})
export class BridgeDataService {
  private readonly selectLifecycleOptions$: BehaviorSubject<
    SelectLifecycleDTO[] | []
  > = new BehaviorSubject<SelectLifecycleDTO[] | []>([]);
  readonly selectLifecycleOptionsObs$: Observable<SelectLifecycleDTO[] | []> =
    this.selectLifecycleOptions$.asObservable();

  private readonly inputLifecycleOptions$: Subject<MediaLifecycleDTO> =
    new Subject<MediaLifecycleDTO>();

  readonly inputLifecycleOptionsObs$: Observable<MediaLifecycleDTO> =
    this.inputLifecycleOptions$.asObservable();

  constructor() {}

  pushSelectLifecycleOptions(lifecycleOptions: SelectLifecycleDTO[]) {
    this.selectLifecycleOptions$.next(lifecycleOptions);
  }

  pushInputLifecycleOptions(mediaLifecycleDTO: MediaLifecycleDTO) {
    this.inputLifecycleOptions$.next(mediaLifecycleDTO);
  }
}
