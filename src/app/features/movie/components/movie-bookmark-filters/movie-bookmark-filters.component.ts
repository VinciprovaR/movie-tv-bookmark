import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { filter, Observable, takeUntil } from 'rxjs';
import { MovieBookmarkSelectors } from '../../../../core/store/movie-bookmark';
import { AbstractBookmarkFilters } from '../../../../shared/abstract/components/abstract-bookmark-filters.component';
import { GenreFilterComponent } from '../../../../shared/components/genre-filter/genre-filter.component';
import { SelectFilterComponent } from '../../../../shared/components/select-filter/select-filter.component';
import { CustomHttpErrorResponseInterface } from '../../../../shared/interfaces/customHttpErrorResponse.interface';
import { PayloadMovieBookmark } from '../../../../shared/interfaces/store/movie-bookmark-state.interface';
import { BookmarkMovieFilterForm, Genre } from '../../../../shared/interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-movie-bookmark-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    SelectFilterComponent,
    MatIconModule,
  ],
  templateUrl: './movie-bookmark-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieBookmarkFiltersComponent extends AbstractBookmarkFilters<
  PayloadMovieBookmark,
  BookmarkMovieFilterForm
> {
  selectBookmarkFailure$: Observable<CustomHttpErrorResponseInterface | null> =
    this.store.select(MovieBookmarkSelectors.selectMovieBookmarkError);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.combinedBookmarkFilters$
      .pipe(
        takeUntil(this.destroyed$),
        filter((formData) => formData[1].length > 0)
      )
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
      });

    this.selectBookmarkFailure$
      .pipe(
        takeUntil(this.destroyed$),
        filter(
          (error: CustomHttpErrorResponseInterface | null) => error != null
        )
      )
      .subscribe((error: CustomHttpErrorResponseInterface | null) => {
        this.toggleButtonSearch(false);
      });
  }

  override buildForm(
    filterSelected: PayloadMovieBookmark,
    genreList: Genre[]
  ): void {
    this.filterForm = this.fb.group<BookmarkMovieFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
    });
    this.registerBehaviourValueChange();
    this.detectChanges();
  }

  override onSubmit(): void {
    if (this.filterForm.valid) {
      this.toggleButtonSearch(true);
      let payload: PayloadMovieBookmark = this.buildPayload();
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
