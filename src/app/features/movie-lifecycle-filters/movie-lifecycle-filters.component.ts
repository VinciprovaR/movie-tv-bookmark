import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, Observable, takeUntil } from 'rxjs';
import { AbstractLifecycleFilters } from '../../shared/components/abstract/abstract-lifecycle-filters.component';

import {
  Genre,
  LifecycleMovieFilterForm,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import { PayloadMovieLifecycle } from '../../shared/interfaces/store/movie-lifecycle-state.interface';
import { GenreFilterComponent } from '../../shared/components/genre-filter/genre-filter.component';
import { SelectFilterComponent } from '../../shared/components/select-filter/select-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MovieLifecycleSelectors } from '../../shared/store/movie-lifecycle';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-movie-lifecycle-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    SelectFilterComponent,
    MatIconModule,
  ],
  templateUrl: './movie-lifecycle-filters.component.html',
  styleUrl: './movie-lifecycle-filters.component.css',
})
export class MovieLifecycleFiltersComponent extends AbstractLifecycleFilters<
  PayloadMovieLifecycle,
  LifecycleMovieFilterForm
> {
  selectLifecycleFailure$: Observable<HttpErrorResponse | null> =
    this.store.select(MovieLifecycleSelectors.selectMovieLifecycleError);

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
    filterSelected: PayloadMovieLifecycle,
    genreList: Genre[]
  ): void {
    this.filterForm = this.fb.group<LifecycleMovieFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
    });
    this.registerBehaviourValueChange();
  }

  override onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      this.toggleButtonSearch(true);
      let payload: PayloadMovieLifecycle = this.buildPayload();
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
