import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  lifecycleEnum,
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BridgeDataService } from '../../services/bridge-data.service';
import { LifecycleOption } from '../../interfaces/supabase/DTO';
import {
  MediaType,
  Movie,
  MovieDetail,
  TV,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';

import { LifecycleMetadataSelectors } from '../../store/lifecycle-metadata';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';
import { MatIconModule } from '@angular/material/icon';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-lifecycle-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './lifecycle-selector.component.html',
  styleUrl: './lifecycle-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifecycleSelectorComponent
  extends AbstractComponent
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly bridgeDataService = inject(BridgeDataService);
  //to-do refractor type
  readonly lifecycleStatusMap = inject(LIFECYCLE_STATUS_MAP);

  lifecycleOptions$!: Observable<LifecycleOption[]>;

  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  mediaData!: Movie | MovieDetail | Movie_Data | TV | TVDetail | TV_Data;
  @Input()
  personIdentifier: string = '';

  idItem!: string;

  lifecycleControl!: FormControl<lifecycleEnum>;

  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';

  @Output()
  lifecycleStatusElementEmitter = new EventEmitter<lifecycleEnum>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.idItem = `${this.personIdentifier ? `${this.personIdentifier}_` : ''}${
      this.index
    }_${this.mediaData.id}`;

    this.initSelectors();
    this.buildControl();
    this.initDataBridge();
  }

  override initSelectors() {
    this.lifecycleOptions$ = this.store.select(
      LifecycleMetadataSelectors.selectLifecycleOptions
    );
  }

  override initSubscriptions(): void {}

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
      .subscribe((lifecycleEnum: lifecycleEnum) => {
        this.updatedLifecycleChange(lifecycleEnum);
        this.updateControlValue(lifecycleEnum);
      });
  }

  buildControl() {
    this.lifecycleControl = this.fb.control('noLifecycle', {
      nonNullable: true,
    });

    // this.updatedLifecycleChange('noLifecycle');

    this.lifecycleControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((lifecycleEnum) => {
        this.notifyLifecycleChange(lifecycleEnum);
      });
  }

  notifyLifecycleChange(lifecycleEnum: lifecycleEnum) {
    this.bridgeDataService.pushInputLifecycleOptions(this.mediaType, {
      mediaDataDTO: this.mediaData,
      lifecycleEnum: lifecycleEnum,
      // index: this.index,
    });
  }

  updatedLifecycleChange(lifecycleEnum: lifecycleEnum) {
    this.lifecycleEnumSelected = lifecycleEnum;
    this.lifecycleStatusElementEmitter.emit(lifecycleEnum);
  }

  updateControlValue(lifecycleEnum: lifecycleEnum) {
    this.lifecycleControl.setValue(
      lifecycleEnum ? lifecycleEnum : 'noLifecycle',
      { emitEvent: false }
    );
  }
}
