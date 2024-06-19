import { Component, Input, OnInit, input } from '@angular/core';
import { Store } from '@ngrx/store';

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
import { distinctUntilChanged } from 'rxjs';

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
  lifecycleId!: number;
  @Input({ required: true })
  index!: number;
  @Input({ required: true })
  mediaType!: MediaType;
  lifeCycleControl!: FormControl;

  options = [
    { label: 'No lifecycle', value: 0 },
    { label: 'Watchlist', value: 1 },
    { label: 'Watched ', value: 2 },
    { label: 'Rewatch', value: 3 },
  ];

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.lifeCycleControl = this.fb.control(
      this.lifecycleId ? this.lifecycleId : 0
    );

    // this.lifeCycleControl.setValue(this.options[0], { emitEvent: false });

    this.lifeCycleControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((lifecycleId) => {
        this.setLifeCycle(lifecycleId);
      });
  }

  setLifeCycle(lifecycleId: number) {
    if (this.mediaType === 'movie') {
      this.store.dispatch(
        SearchMovieActions.createOrUpdateOrDeleteMovieLifecycleLifecycle({
          movieId: this.mediaId,
          lifecycleId: lifecycleId,
          index: this.index,
        })
      );
    } else if (this.mediaType === 'tv') {
    }
  }
}
