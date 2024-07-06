import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { lifeCycleId } from '../../interfaces/lifecycle.interface';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import { Media_Lifecycle_Options } from '../../interfaces/supabase/entities/media_life_cycle_enum.entity.interface';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BridgeDataService } from '../../services/bridge-data.service';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../interfaces/supabase/DTO';
import { MovieLifecycleMap } from '../../interfaces/store/movie-lifecycle-state.interface';
import { TVLifecycleMap } from '../../interfaces/store/tv-lifecycle-state.interface';
import { MediaType } from '../../interfaces/media.interface';
import { LifecycleEnum } from '../../enums/lifecycle.enum';

@Component({
  selector: 'app-lifecycle-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './lifecycle-selector.component.html',
  styleUrl: './lifecycle-selector.component.css',
})
export class LifecycleSelectorComponent implements OnInit {
  destroyed$ = new Subject();

  @Input({ required: true })
  mediaId!: number;
  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;

  lifecycleOptions: SelectLifecycleDTO[] = [
    { label: 'No lifecycle', value: LifecycleEnum.NoLifecycle },
    { label: 'Watchlist', value: LifecycleEnum.WatchListLifecycle },
    { label: 'Watched', value: LifecycleEnum.WatchedLifecycle },
    { label: 'Rewatch', value: LifecycleEnum.RewatchLifecycle },
    { label: 'Still Watching', value: LifecycleEnum.StillWatchingLifecycle },
  ];

  lifecycleOptions$!: Observable<Media_Lifecycle_Options[] | []>;
  lifecycleControl: FormControl<lifeCycleId> = this.fb.control(0, {
    nonNullable: true,
  });

  constructor(
    private fb: FormBuilder,
    private bridgeDataService: BridgeDataService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.bridgeDataService.mediaLifecycleMapObs$
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged(),
        map((mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap | null) => {
          return mediaLifecycleMap && mediaLifecycleMap[this.mediaId]
            ? mediaLifecycleMap[this.mediaId]
            : 0;
        }),
        filter((lifeCycleId) => lifeCycleId > LifecycleEnum.NoLifecycle)
      )
      .subscribe((lifecycleId) => {
        this.lifecycleControl.setValue(
          lifecycleId ? lifecycleId : LifecycleEnum.NoLifecycle,
          { emitEvent: false }
        );
      });

    this.lifecycleControl.valueChanges.subscribe((lifecycleId) => {
      this.setLifeCycle(lifecycleId);
    });
  }

  setLifeCycle(lifecycleId: lifeCycleId) {
    let mediaLifecycleDTO: MediaLifecycleDTO = {
      mediaId: this.mediaId,
      lifecycleId: +lifecycleId as lifeCycleId,
      index: this.index,
    };

    this.bridgeDataService.pushInputLifecycleOptions(mediaLifecycleDTO);
  }
}
