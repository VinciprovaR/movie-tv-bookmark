import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, Observable, takeUntil } from 'rxjs';
import { AbstractLifecycleFilters } from '../../shared/components/abstract/abstract-lifecycle-filters.component';

import {
  Genre,
  LifecycleTVFilterForm,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import { Component } from '@angular/core';
import { PayloadTVLifecycle } from '../../shared/interfaces/store/tv-lifecycle-state.interface';
import { GenreFilterComponent } from '../../shared/components/genre-filter/genre-filter.component';
import { SelectFilterComponent } from '../../shared/components/select-filter/select-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { TVLifecycleSelectors } from '../../shared/store/tv-lifecycle';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tv-lifecycle-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    SelectFilterComponent,
    MatIconModule,
  ],
  templateUrl: './tv-lifecycle-filters.component.html',
  styleUrl: './tv-lifecycle-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVLifecycleFiltersComponent extends AbstractLifecycleFilters<
  PayloadTVLifecycle,
  LifecycleTVFilterForm
> {
  selectLifecycleFailure$: Observable<HttpErrorResponse | null> =
    this.store.select(TVLifecycleSelectors.selectTVLifecycleError);
  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.initSubscriptions();
  }

  override initSelectors(): void {}

  override initSubscriptions(): void {
    this.combinedLifecycleFilters$
      .pipe(
        takeUntil(this.destroyed$),
        filter((formData) => formData[1].length > 0)
      )
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
      });

    this.selectLifecycleFailure$
      .pipe(
        takeUntil(this.destroyed$),
        filter((error: HttpErrorResponse | null) => error != null)
      )
      .subscribe((error: HttpErrorResponse | null) => {
        this.toggleButtonSearch(false);
      });
  }

  override buildForm(
    filterSelected: PayloadTVLifecycle,
    genreList: Genre[]
  ): void {
    this.filterForm = this.fb.group<LifecycleTVFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
    });

    this.registerBehaviourValueChange();
  }

  override onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      this.toggleButtonSearch(true);
      let payload: PayloadTVLifecycle = this.buildPayload();
      this.payloadEmitterOnSubmit.emit(payload);
    }
  }

  override buildPayload() {
    return {
      genreIdList: this.buildGenresSelectedListPayload(
        this.filterForm.controls.genres
      ),
      sortBy: this.buildSortByPayload(this.filterForm.controls.sortBy),
    };
  }
}
