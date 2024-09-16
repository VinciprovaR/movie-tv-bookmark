import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { filter, Observable, takeUntil } from 'rxjs';
import { TVBookmarkSelectors } from '../../../../core/store/tv-bookmark';
import { AbstractBookmarkFilters } from '../../../../shared/abstract/components/abstract-bookmark-filters.component';
import { GenreFilterComponent } from '../../../../shared/components/genre-filter/genre-filter.component';
import { SelectFilterComponent } from '../../../../shared/components/select-filter/select-filter.component';
import { CustomHttpErrorResponseInterface } from '../../../../shared/interfaces/customHttpErrorResponse.interface';
import { PayloadTVBookmark } from '../../../../shared/interfaces/store/tv-bookmark-state.interface';
import {
  BookmarkTVFilterForm,
  Genre,
} from '../../../../shared/interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-tv-bookmark-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    SelectFilterComponent,
    MatIconModule,
  ],
  templateUrl: './tv-bookmark-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVBookmarkFiltersComponent extends AbstractBookmarkFilters<
  PayloadTVBookmark,
  BookmarkTVFilterForm
> {
  selectBookmarkFailure$: Observable<CustomHttpErrorResponseInterface | null> =
    this.store.select(TVBookmarkSelectors.selectTVBookmarkError);
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
    filterSelected: PayloadTVBookmark,
    genreList: Genre[]
  ): void {
    this.filterForm = this.fb.group<BookmarkTVFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
    });

    this.registerBehaviourValueChange();
    this.detectChanges();
  }

  override onSubmit(): void {
    if (this.filterForm.valid) {
      this.toggleButtonSearch(true);
      let payload: PayloadTVBookmark = this.buildPayload();
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
