import {
  APP_INITIALIZER,
  Component,
  Inject,
  Input,
  OnInit,
  input,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { LifecycleEnumSelectors } from '../../store/lifecycle-enum';
import { SearchMovieActions } from '../../store/search-movie';
import { MediaType } from '../../models/media.models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { LIFECYCLE_ENUM } from '../../../providers';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { SearchTVActions } from '../../store/search-tv';

@Component({
  selector: 'app-lifecycle-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzFormModule,
    NzIconModule,
  ],
  templateUrl: './lifecycle-selector.component.html',
  styleUrl: './lifecycle-selector.component.css',
})
export class LifecycleSelectorComponent implements OnInit {
  @Input({ required: true })
  mediaId!: number;
  @Input({ required: true })
  lifecycleId!: number | undefined;
  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;

  lifeCycleControl!: FormControl;

  lifeCycleEnum$!: Observable<Media_Lifecycle_Enum[] | []>;

  options$!: Observable<any>;

  options = [
    { label: 'No lifecycle', value: 0 },
    { label: 'Watchlist', value: 1 },
    { label: 'Watched ', value: 2 },
    { label: 'Rewatch', value: 3 },
  ];

  constructor(private store: Store, private fb: FormBuilder) {}
  //to-do refractor? no selector, hardcoded, più leggero
  ngOnInit(): void {
    this.lifeCycleEnum$ = this.store.select(
      LifecycleEnumSelectors.selectMovieLifecycleEnum
    );

    this.options$ = this.lifeCycleEnum$.pipe(
      map((lifecycleEnum) => {
        return lifecycleEnum.map((lc) => {
          return { label: lc.label, value: lc.id };
        });
      })
    );

    this.lifeCycleControl = this.fb.control(
      this.lifecycleId ? this.lifecycleId : 0
    );

    this.lifeCycleControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((lifecycleId) => {
        this.setLifeCycle(lifecycleId);
      });
  }

  setLifeCycle(lifecycleId: number) {
    let mediaLifecycleDTO = {
      mediaId: this.mediaId,
      lifecycleId: lifecycleId,
      index: this.index,
    };
    if (this.mediaType === 'movie') {
      this.store.dispatch(
        SearchMovieActions.createUpdateDeleteMovieLifecycle({
          mediaLifecycleDTO,
        })
      );
    } else if (this.mediaType === 'tv') {
      this.store.dispatch(
        SearchTVActions.createUpdateDeleteTVLifecycle({
          mediaLifecycleDTO,
        })
      );
    }
  }
}
