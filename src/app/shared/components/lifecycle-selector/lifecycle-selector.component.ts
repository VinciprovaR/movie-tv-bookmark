import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import {
  lifeCycleId,
  MediaLifecycleMap,
} from '../../interfaces/lifecycle.interface';
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

import { MediaType } from '../../interfaces/media.interface';
import { LifecycleEnum } from '../../enums/lifecycle.enum';
import { SupabaseLifecycleService } from '../../services/supabase';

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
  lifecycleOptions$!: Observable<LifecycleOption[]>;
  lifecycleOptions!: LifecycleOption[];

  @Input({ required: true })
  mediaId!: number;
  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;

  lifecycleControl!: FormControl<lifeCycleId>;

  constructor(
    private fb: FormBuilder,
    private bridgeDataService: BridgeDataService,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.lifecycleOptions$ = this.supabaseLifecycleService.lifecycleOptions$;
    this.buildControl();
    this.initDataBridge();
  }

  initDataBridge() {
    this.bridgeDataService.mediaLifecycleMapObs$
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged(),
        map((mediaLifecycleMap: MediaLifecycleMap | null) => {
          return mediaLifecycleMap && mediaLifecycleMap[this.mediaId]
            ? mediaLifecycleMap[this.mediaId]
            : 0;
        }),
        filter((lifeCycleId) => {
          return lifeCycleId > LifecycleEnum.NoLifecycle;
        })
      )
      .subscribe((lifecycleId) => {
        this.lifecycleControl.setValue(
          lifecycleId ? lifecycleId : LifecycleEnum.NoLifecycle,
          { emitEvent: false }
        );
      });
  }

  buildControl() {
    this.lifecycleControl = this.fb.control(LifecycleEnum.NoLifecycle, {
      nonNullable: true,
    });

    this.lifecycleControl.valueChanges.subscribe((lifecycleId) => {
      this.setLifeCycle(lifecycleId);
    });
  }

  setLifeCycle(lifecycleId: lifeCycleId) {
    this.bridgeDataService.pushInputLifecycleOptions({
      mediaId: this.mediaId,
      lifecycleId: lifecycleId,
      index: this.index,
    });
  }
}
