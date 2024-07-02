import {
  Component,
  DestroyRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import {
  DiscoveryFilterForm,
  Genre,
  GenreControl,
  GenreGroup,
  ReleaseDateGroup,
} from '../../models/tmdb-filters.models';
import { MediaType } from '../../models/media.models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenreTagComponent } from '../genre-tag/genre-tag.component';
import {
  PayloadDiscoveryMovie,
  ReleaseDate,
} from '../../models/store/discovery-movie-state.models';
import { GenreFilterComponent } from '../genre-filter/genre-filter.component';
import { OrderByFilterComponent } from '../order-by-filter/order-by-filter.component';
import { ReleaseDateFilterComponent } from '../release-date-filter/release-date-filter.component';
import { IncludeLifecycleFilterComponent } from '../include-lifecycle-filter/include-lifecycle-filter.component';

/*
Filtri da fare: 
  - Escludi/includi già in lifecycle
  - Certification
  - Language
  - User Score
*/

@Component({
  selector: 'app-discovery-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreTagComponent,
    GenreFilterComponent,
    OrderByFilterComponent,
    ReleaseDateFilterComponent,
    IncludeLifecycleFilterComponent,
  ],
  templateUrl: './discovery-filters.component.html',
  styleUrl: './discovery-filters.component.css',
})
export class DiscoveryFiltersComponent implements OnInit {
  destroyed$ = new Subject();
  filterForm!: FormGroup<DiscoveryFilterForm>;

  @Input({ required: true })
  mediaType!: MediaType;

  @Input({ required: true })
  payload$!: Observable<PayloadDiscoveryMovie>;

  @Output()
  payloadEmitter: EventEmitter<PayloadDiscoveryMovie> =
    new EventEmitter<PayloadDiscoveryMovie>();

  @Input({ required: true })
  genreList$!: Observable<Genre[] | []>;

  constructor(private fb: FormBuilder) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    combineLatest([this.payload$, this.genreList$])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
      });
  }

  buildForm(filterSelected: PayloadDiscoveryMovie, genreList: Genre[]): void {
    const {
      genreIdList: genreIdListSelected,
      sortBy: sortBySelected,
      releaseDate: releaseDateSelected,
      includeLifecycle: includeLifecycleSelected,
    } = filterSelected;

    const genresGroup = this.fb.group<GenreGroup>({
      ...this.initGenreGroup(genreIdListSelected, genreList),
    });

    const sortByControl = this.fb.control<string>(sortBySelected, {
      nonNullable: true,
    });

    const releaseDateGroup = this.fb.group<ReleaseDateGroup>(
      this.initReleaseDateGroup(releaseDateSelected)
    );

    const includeLifecycleControl = this.fb.control<boolean>(
      includeLifecycleSelected,
      {
        nonNullable: true,
      }
    );

    this.filterForm = this.fb.group<DiscoveryFilterForm>({
      genres: genresGroup,
      sortBy: sortByControl,
      releaseDate: releaseDateGroup,
      includeLifecycle: includeLifecycleControl,
    });
  }

  initGenreGroup(genresSelected: number[], genreList: Genre[]): GenreGroup {
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

    return genreGroup;
  }

  initReleaseDateGroup(releaseDateSelected: ReleaseDate): ReleaseDateGroup {
    const fromSelected = releaseDateSelected.from
      ? new Date(releaseDateSelected.from)
      : null;

    const toSelected = releaseDateSelected.to
      ? new Date(releaseDateSelected.to)
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    return {
      from: this.fb.control<Date | null>(fromSelected, { nonNullable: true }),
      to: this.fb.control<Date>(toSelected, {
        nonNullable: true,
      }),
    };
  }

  onSubmit(): void {
    console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      let payload: PayloadDiscoveryMovie = this.buildPayload();
      this.payloadEmitter.emit(payload);
    }
  }

  buildPayload(): PayloadDiscoveryMovie {
    return {
      genreIdList: this.buildGenresSelectedListPayload(),
      sortBy: this.buildSortBy(),
      releaseDate: this.buildReleaseDatePayload(),
      includeLifecycle: this.buildIncludeLifecyclePayload(),
    };
  }

  buildGenresSelectedListPayload(): number[] {
    let genresSelectedId: number[] = [];

    if (this.filterForm.value.genres) {
      Object.entries(this.filterForm.value.genres).forEach((entries) => {
        let [genreId, genre]: [string, any] = entries;
        if (genre.isSelected) {
          genresSelectedId.push(+genreId);
        }
      });
    }

    return genresSelectedId;
  }

  buildSortBy(): string {
    return this.filterForm.value?.sortBy ? this.filterForm.value.sortBy : '';
  }

  buildReleaseDatePayload() {
    return {
      from: this.formatDate(this.filterForm.value?.releaseDate?.from),
      to: this.formatDate(this.filterForm.value?.releaseDate?.to),
    };
  }

  buildIncludeLifecyclePayload() {
    return this.filterForm.value?.includeLifecycle
      ? this.filterForm.value?.includeLifecycle
      : false;
  }

  formatDate(date: Date | null | undefined): string {
    if (date) {
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0');
      let day = String(date.getDate()).padStart(2, '0');

      // Format the date as yyyy-mm-dd
      return `${year}-${month}-${day}`;
    }
    return '';
  }
}
