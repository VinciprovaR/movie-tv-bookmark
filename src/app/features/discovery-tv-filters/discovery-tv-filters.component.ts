import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import {
  Certification,
  DiscoveryTVFilterForm,
  Genre,
} from '../../shared/interfaces/tmdb-filters.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PayloadDiscoveryTV } from '../../shared/interfaces/store/discovery-tv-state.interface';
import { GenreFilterComponent } from '../../shared/components/genre-filter/genre-filter.component';
import { OrderByFilterComponent } from '../../shared/components/order-by-filter/order-by-filter.component';
import { RangeDateFilterComponent } from '../../shared/components/range-date-filter/range-date-filter.component';
import { CheckboxFilterComponent } from '../../shared/components/checkbox-filter/checkbox-filter.component';
import { CertificationFilterComponent } from '../../shared/components/certification-filter/certification-filter.component';
import { LanguageFilterComponent } from '../../shared/components/language-filter/language-filter.component';
import { VoteAverageFilterComponent } from '../../shared/components/vote-average-filter/vote-average-filter.component';
import { filter, takeUntil } from 'rxjs';

import { DiscoveryFilter } from '../../shared/directives/discovery.filter.directive';

@Component({
  selector: 'app-discovery-tv-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    OrderByFilterComponent,
    RangeDateFilterComponent,
    CheckboxFilterComponent,
    CertificationFilterComponent,
    LanguageFilterComponent,
    VoteAverageFilterComponent,
  ],
  templateUrl: './discovery-tv-filters.component.html',
  styleUrl: './discovery-tv-filters.component.css',
})
export class DiscoveryTVFiltersComponent
  extends DiscoveryFilter<PayloadDiscoveryTV, DiscoveryTVFilterForm>
  implements OnInit
{
  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.combinedDiscoveryFilters$
      .pipe(
        takeUntil(this.destroyed$),
        filter((formData) => formData[1].length > 0)
      )
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
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
      includeLifecycle: this.initIncludeLifecycleControl(
        filterSelected.includeMediaWithLifecycle
      ),
      languages: this.initLanguagesControl(filterSelected.language),
      voteAverage: this.initVoteAverageGroup(filterSelected.voteAverage),
    });

    this.filterForm.controls['airDate'].addValidators(
      this.releaseDateValidatorFactory()
    );
  }

  initAllEpisodeControl(allEpisode: boolean): FormControl<boolean> {
    return this.fb.control<boolean>(allEpisode, {
      nonNullable: true,
    });
  }

  override onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
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
      includeMediaWithLifecycle: this.buildIncludeLifecyclePayload(
        this.filterForm.controls.includeLifecycle
      ),

      language: this.buildLanguagePayload(this.filterForm.controls.languages),
      voteAverage: this.buildVoteAveragePayload(
        this.filterForm.controls.voteAverage
      ),
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
