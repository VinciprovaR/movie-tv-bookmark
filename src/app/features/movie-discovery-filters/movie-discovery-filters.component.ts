import { Component, inject, Input, OnInit } from '@angular/core';
import {
  Certification,
  DiscoveryMovieFilterForm,
  Genre,
  OptionFilter,
  SelectTransformConfig,
} from '../../shared/interfaces/TMDB/tmdb-filters.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PayloadDiscoveryMovie } from '../../shared/interfaces/store/discovery-movie-state.interface';
import { GenreFilterComponent } from '../../shared/components/genre-filter/genre-filter.component';
import { RangeDateFilterComponent } from '../../shared/components/range-date-filter/range-date-filter.component';
import { CheckboxFilterComponent } from '../../shared/components/checkbox-filter/checkbox-filter.component';
import { VoteAverageFilterComponent } from '../../shared/components/vote-average-filter/vote-average-filter.component';
import { filter, Observable, takeUntil } from 'rxjs';
import { AbstractDiscoveryFilter } from '../../shared/components/abstract/abstract-discovery-filter.component';
import { SelectFilterComponent } from '../../shared/components/select-filter/select-filter.component';
import { MinVoteFilterComponent } from '../../shared/components/min-vote-filter/min-vote-filter.component';
import { MatIconModule } from '@angular/material/icon';

import { HttpErrorResponse } from '@angular/common/http';
import { DiscoveryMovieSelectors } from '../../shared/store/discovery-movie';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-discovery-movie-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    RangeDateFilterComponent,
    CheckboxFilterComponent,
    VoteAverageFilterComponent,
    SelectFilterComponent,
    MinVoteFilterComponent,
    MatIconModule,
  ],
  templateUrl: './movie-discovery-filters.component.html',
  styleUrl: './movie-discovery-filters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDiscoveryFiltersComponent
  extends AbstractDiscoveryFilter<
    PayloadDiscoveryMovie,
    DiscoveryMovieFilterForm
  >
  implements OnInit
{
  @Input({ required: true })
  certificationList!: Certification[];
  certificationsTransformConfig: SelectTransformConfig = {
    labelKey: 'certification',
    valueKey: 'certification',
  };
  certificationsDefaultOption: OptionFilter = {
    label: 'No certification selected',
    value: '',
  };

  selectDiscoveryFailure$: Observable<HttpErrorResponse | null> =
    this.store.select(DiscoveryMovieSelectors.selectError);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.initSubscriptions();
  }
  override initSelectors(): void {}

  override initSubscriptions(): void {
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
        filter((error: HttpErrorResponse | null) => error != null)
      )
      .subscribe((error: HttpErrorResponse | null) => {
        this.toggleButtonSearch(false);
      });
  }

  override buildForm(
    filterSelected: PayloadDiscoveryMovie,
    genreList: Genre[]
  ): void {
    this.filterForm = this.fb.group<DiscoveryMovieFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
      releaseDate: this.initDateRangeGroup(filterSelected.releaseDate),
      includeLifecycle: this.initIncludeLifecycleControl(
        filterSelected.includeMediaWithLifecycle
      ),
      certifications: this.initCertificationsControl(
        filterSelected.certification
      ),
      languages: this.initLanguagesControl(filterSelected.language),
      voteAverage: this.initVoteAverageGroup(filterSelected.voteAverage),
      minVote: this.initMinVoteControl(filterSelected.minVote),
    });

    this.filterForm.controls['releaseDate'].addValidators(
      this.releaseDateValidatorFactory()
    );

    this.registerBehaviourValueChange();
  }

  initCertificationsControl(
    certificationSelected: string
  ): FormControl<string> {
    return this.fb.control<string>(certificationSelected, {
      nonNullable: true,
    });
  }

  override onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      this.toggleButtonSearch(true);
      let payload: PayloadDiscoveryMovie = this.buildPayload();
      this.payloadEmitterOnSubmit.emit(payload);
    }
  }

  override buildPayload() {
    return {
      genreIdList: this.buildGenresSelectedListPayload(
        this.filterForm.controls.genres
      ),
      sortBy: this.buildSortByPayload(this.filterForm.controls.sortBy),
      releaseDate: this.buildDateRangePayload(
        this.filterForm.controls.releaseDate
      ),
      includeMediaWithLifecycle: this.buildIncludeLifecyclePayload(
        this.filterForm.controls.includeLifecycle
      ),
      certification: this.buildCertificationPayload(
        this.filterForm.controls.certifications
      ),
      language: this.buildLanguagePayload(this.filterForm.controls.languages),
      voteAverage: this.buildVoteAveragePayload(
        this.filterForm.controls.voteAverage
      ),
      minVote: this.buildMinVotePayload(this.filterForm.controls.minVote),
    };
  }

  buildCertificationPayload(certificationControl: FormControl<string>): string {
    return certificationControl.value ? certificationControl.value : '';
  }
}
