import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { filter, Observable, takeUntil } from 'rxjs';
import { DiscoveryTVSelectors } from '../../../../core/store/discovery-tv';
import { AbstractDiscoveryFilter } from '../../../../shared/abstract/components/abstract-discovery-filter.component';
import { CheckboxFilterComponent } from '../../../../shared/components/checkbox-filter/checkbox-filter.component';
import { GenreFilterComponent } from '../../../../shared/components/genre-filter/genre-filter.component';
import { MinVoteFilterComponent } from '../../../../shared/components/min-vote-filter/min-vote-filter.component';
import { RangeDateFilterComponent } from '../../../../shared/components/range-date-filter/range-date-filter.component';
import { SelectFilterComponent } from '../../../../shared/components/select-filter/select-filter.component';
import { VoteAverageFilterComponent } from '../../../../shared/components/vote-average-filter/vote-average-filter.component';
import { CustomHttpErrorResponseInterface } from '../../../../shared/interfaces/customHttpErrorResponse.interface';
import { PayloadDiscoveryTV } from '../../../../shared/interfaces/store/discovery-tv-state.interface';
import { DiscoveryTVFilterForm, Genre } from '../../../../shared/interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-discovery-tv-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    SelectFilterComponent,
    RangeDateFilterComponent,
    CheckboxFilterComponent,
    VoteAverageFilterComponent,
    MinVoteFilterComponent,
    MatIconModule,
  ],
  templateUrl: './tv-discovery-filters.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TVDiscoveryFiltersComponent
  extends AbstractDiscoveryFilter<PayloadDiscoveryTV, DiscoveryTVFilterForm>
  implements OnInit
{
  selectDiscoveryFailure$: Observable<CustomHttpErrorResponseInterface | null> =
    this.store.select(DiscoveryTVSelectors.selectError);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.combinedDiscoveryFilters$
      .pipe(
        takeUntil(this.destroyed$),
        filter((formData) => formData[1].length > 0)
      )
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
      });

    this.selectDiscoveryFailure$
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
    filterSelected: PayloadDiscoveryTV,
    genreList: Genre[]
  ): void {
    this.filterForm = this.fb.group<DiscoveryTVFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      allEpisode: this.initAllEpisodeControl(filterSelected.allEpisode),
      sortBy: this.initSortByControl(filterSelected.sortBy),
      airDate: this.initDateRangeGroup(filterSelected.airDate),
      includeBookmark: this.initIncludeBookmarkControl(
        filterSelected.includeMediaWithBookmark
      ),
      languages: this.initLanguagesControl(filterSelected.language),
      voteAverage: this.initVoteAverageGroup(filterSelected.voteAverage),
      minVote: this.initMinVoteControl(filterSelected.minVote),
    });

    this.filterForm.controls['airDate'].addValidators(
      this.releaseDateValidatorFactory()
    );

    this.registerBehaviourValueChange();
    this.detectChanges();
  }

  initAllEpisodeControl(allEpisode: boolean): FormControl<boolean> {
    return this.fb.control<boolean>(allEpisode, {
      nonNullable: true,
    });
  }

  override onSubmit(): void {
    if (this.filterForm.valid) {
      this.toggleButtonSearch(true);
      let payload: PayloadDiscoveryTV = this.buildPayload();
      this.payloadEmitterOnSubmit.emit(payload);
    }
  }

  override buildPayload() {
    let payloadDiscoveryTV: PayloadDiscoveryTV = {
      genreIdList: this.buildGenresSelectedListPayload(
        this.filterForm.controls.genres
      ),
      allEpisode: this.buildAllEpisodePayload(
        this.filterForm.controls.allEpisode
      ),
      sortBy: this.buildSortByPayload(this.filterForm.controls.sortBy),
      airDate: this.buildDateRangePayload(this.filterForm.controls.airDate),
      includeMediaWithBookmark: this.buildIncludeBookmarkPayload(
        this.filterForm.controls.includeBookmark
      ),

      language: this.buildLanguagePayload(this.filterForm.controls.languages),
      voteAverage: this.buildVoteAveragePayload(
        this.filterForm.controls.voteAverage
      ),
      minVote: this.buildMinVotePayload(this.filterForm.controls.minVote),
    };

    return payloadDiscoveryTV;
  }

  buildAllEpisodePayload(allEpisode: FormControl<boolean>): boolean {
    return allEpisode.value ? allEpisode.value : false;
  }

  getAllEpisodeControlValue(): boolean {
    return this.filterForm.controls.allEpisode.value
      ? this.filterForm.controls.allEpisode.value
      : false;
  }
}
