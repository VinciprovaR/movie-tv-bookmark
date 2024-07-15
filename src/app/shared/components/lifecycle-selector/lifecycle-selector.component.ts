import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import {
  lifeCycleId,
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
} from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BridgeDataService } from '../../services/bridge-data.service';
import { LifecycleOption } from '../../interfaces/supabase/DTO';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { LifecycleEnum } from '../../enums/lifecycle.enum';
import { Store } from '@ngrx/store';
import { LifecycleMetadataSelectors } from '../../store/lifecycle-metadata';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';

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
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly bridgeDataService = inject(BridgeDataService);

  destroyed$ = new Subject();
  lifecycleOptions$!: Observable<LifecycleOption[]>;

  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  mediaData!: Movie | TV | Movie_Data | TV_Data;

  lifecycleControl!: FormControl<lifeCycleId>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
    this.buildControl();
    this.initDataBridge();
  }

  initSelectors() {
    this.lifecycleOptions$ = this.store.select(
      LifecycleMetadataSelectors.selectLifecycleOptions
    );
  }

  initDataBridge() {
    this.bridgeDataService.mediaLifecycleMapObs$
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged(),
        filter((mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap) => {
          return mediaLifecycleMap &&
            (mediaLifecycleMap[this.mediaData.id] != null ||
              mediaLifecycleMap[this.mediaData.id] != undefined)
            ? true
            : false;
        }),
        map((mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap) => {
          return mediaLifecycleMap[this.mediaData.id];
        })
      )
      .subscribe((lifecycleId) => {
        this.lifecycleControl.setValue(
          lifecycleId ? lifecycleId : LifecycleEnum.noLifecycle,
          { emitEvent: false }
        );
      });
  }

  buildControl() {
    this.lifecycleControl = this.fb.control(LifecycleEnum.noLifecycle, {
      nonNullable: true,
    });

    this.lifecycleControl.valueChanges.subscribe((lifecycleId) => {
      this.setLifeCycle(lifecycleId);
    });
  }

  setLifeCycle(lifecycleId: lifeCycleId) {
    this.bridgeDataService.pushInputLifecycleOptions(this.mediaType, {
      mediaDataDTO: this.mediaData,
      lifecycleId: lifecycleId,
      index: this.index,
    });
  }
}
