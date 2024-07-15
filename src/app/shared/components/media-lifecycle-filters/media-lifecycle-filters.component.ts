import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import {
  Language,
  GenreGroup,
  GenreControl,
  LifecycleMediaFilterForm,
  Genre,
  OptionFilter,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { SORT_BY_SELECT_MOVIE } from '../../../providers';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import { GenreFilterComponent } from '../genre-filter/genre-filter.component';
import { SelectFilterComponent } from '../select-filter/select-filter.component';

@Component({
  selector: 'app-media-lifecycle-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    SelectFilterComponent,
  ],
  templateUrl: './media-lifecycle-filters.component.html',
  styleUrl: './media-lifecycle-filters.component.css',
})
export class MovieDiscoveryFiltersComponent implements OnInit {
  readonly fb = inject(FormBuilder);

  destroyed$ = new Subject();

  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  languageList!: Language[];
  @Input({ required: true })
  combinedDiscoveryFilters$!: Observable<[any, Genre[]]>;

  @Output()
  payloadEmitterOnSubmit: EventEmitter<any> = new EventEmitter<any>();

  filterForm!: FormGroup<LifecycleMediaFilterForm>;

  sortBySelect: OptionFilter[] = inject(SORT_BY_SELECT_MOVIE);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
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

  buildForm(filterSelected: PayloadDiscoveryMovie, genreList: Genre[]): void {
    this.filterForm = this.fb.group<LifecycleMediaFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
    });
  }

  initGenreGroup(
    genresSelected: number[],
    genreList: Genre[]
  ): FormGroup<GenreGroup> {
    let genreGroup: GenreGroup = {};
    genreList.forEach((genre) => {
      genreGroup[genre.id] = this.fb.control<GenreControl>(
        {
          id: genre.id,
          name: genre.name,
          isSelected: genresSelected.indexOf(genre.id) != -1,
        },
        { nonNullable: true }
      );
    });

    return this.fb.group<GenreGroup>({
      ...genreGroup,
    });
  }
  initSortByControl(sortBySelected: string): FormControl<string> {
    return this.fb.control<string>(sortBySelected, {
      nonNullable: true,
    });
  }

  onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      let payload: PayloadDiscoveryMovie = this.buildPayload();
      this.payloadEmitterOnSubmit.emit(payload);
    }
  }

  buildPayload() {
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
    };
  }

  buildGenresSelectedListPayload(genresGroup: FormGroup<GenreGroup>): number[] {
    let genresSelectedId: number[] = [];
    Object.entries(genresGroup.value).forEach((entries) => {
      let [genreId, genre]: [string, any] = entries;
      if (genre.isSelected) {
        genresSelectedId.push(+genreId);
      }
    });
    return genresSelectedId;
  }

  buildSortByPayload(sortyByControl: FormControl<string>): string {
    return sortyByControl.value ? sortyByControl.value : '';
  }
}
