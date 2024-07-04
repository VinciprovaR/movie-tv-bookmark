import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { LifecycleIdEnum, lifeCycleId } from '../../models/lifecycle.models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs';
import { Media_Lifecycle_Options } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BridgeDataService } from '../../services/bridge-data.service';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../models/supabase/DTO';
import { MovieLifecycleMap } from '../../models/store/movie-lifecycle-state.models';
import { TVLifecycleMap } from '../../models/store/tv-lifecycle-state.models';
import { MediaType } from '../../models/media.models';

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
  options$!: Observable<SelectLifecycleDTO[] | []>;
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
    this.options$ = this.bridgeDataService.selectLifecycleOptionsObs$;

    this.bridgeDataService.mediaLifecycleMapObs$
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged(),
        map((mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap | null) => {
          return mediaLifecycleMap && mediaLifecycleMap[this.mediaId]
            ? mediaLifecycleMap[this.mediaId]
            : 0;
        })
      )
      .subscribe((lifecycleId) => {
        // console.log(lifecycleId);

        this.lifecycleControl.valueChanges.subscribe((lifecycleId) => {
          this.setLifeCycle(lifecycleId);
        });

        this.lifecycleControl.setValue(
          lifecycleId ? lifecycleId : LifecycleIdEnum.NoLifecycle,
          { emitEvent: false }
        );
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
