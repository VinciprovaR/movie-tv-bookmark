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
import { Observable, Subject, combineLatest, map, takeUntil, tap } from 'rxjs';
import {
  Certification,
  Certifications,
  DiscoveryFilterForm,
  Genre,
  GenreControl,
  GenreGroup,
  ReleaseDateGroup,
} from '../../interfaces/tmdb-filters.interface';
import { MediaType } from '../../interfaces/media.interface';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  PayloadDiscoveryMovie,
  ReleaseDate,
} from '../../interfaces/store/discovery-movie-state.interface';
import { GenreFilterComponent } from '../genre-filter/genre-filter.component';
import { OrderByFilterComponent } from '../order-by-filter/order-by-filter.component';
import { ReleaseDateFilterComponent } from '../release-date-filter/release-date-filter.component';
import { IncludeLifecycleFilterComponent } from '../include-lifecycle-filter/include-lifecycle-filter.component';
import { CertificationFilterComponent } from '../certification-filter/certification-filter.component';

/*
Filtri da fare: 
  - Language
  - User Score
*/

@Component({
  selector: 'app-discovery-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreFilterComponent,
    OrderByFilterComponent,
    ReleaseDateFilterComponent,
    IncludeLifecycleFilterComponent,
    CertificationFilterComponent,
  ],
  templateUrl: './discovery-filters.component.html',
  styleUrl: './discovery-filters.component.css',
})
export class DiscoveryFiltersComponent implements OnInit {
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  combinedDiscoveryFilters$!: Observable<[PayloadDiscoveryMovie, Genre[]]>;
  @Input({ required: true })
  certificationList!: Certification[];

  @Output()
  payloadEmitterOnSubmit: EventEmitter<PayloadDiscoveryMovie> =
    new EventEmitter<PayloadDiscoveryMovie>();

  filterForm!: FormGroup<DiscoveryFilterForm>;

  destroyed$ = new Subject();

  constructor(private fb: FormBuilder) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.combinedDiscoveryFilters$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
      });
  }

  buildForm(filterSelected: PayloadDiscoveryMovie, genreList: Genre[]): void {
    const genresGroup = this.initGenreGroup(
      filterSelected.genreIdList,
      genreList
    );

    const sortByControl = this.initSortByControl(filterSelected.sortBy);

    const releaseDateGroup = this.initReleaseDateGroup(
      filterSelected.releaseDate
    );

    const includeLifecycleControl = this.initIncludeLifecycleControl(
      filterSelected.includeMediaWithLifecycle
    );

    const certificationsControl = this.initCertificationsControl(
      filterSelected.certification
    );

    this.filterForm = this.fb.group<DiscoveryFilterForm>({
      genres: genresGroup,
      sortBy: sortByControl,
      releaseDate: releaseDateGroup,
      includeLifecycle: includeLifecycleControl,
      certifications: certificationsControl,
    });

    this.filterForm.controls['releaseDate'].addValidators(
      this.releaseDateValidatorFactory()
    );
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

  initReleaseDateGroup(
    releaseDateSelected: ReleaseDate
  ): FormGroup<ReleaseDateGroup> {
    const fromSelected = releaseDateSelected.from
      ? new Date(releaseDateSelected.from)
      : null;

    const toSelected = releaseDateSelected.to
      ? new Date(releaseDateSelected.to)
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    return this.fb.group<ReleaseDateGroup>({
      from: this.fb.control<Date | null>(fromSelected),
      to: this.fb.control<Date>(toSelected),
    });
  }

  initIncludeLifecycleControl(
    includeMediaWithLifecycleSelected: boolean
  ): FormControl<boolean> {
    return this.fb.control<boolean>(includeMediaWithLifecycleSelected, {
      nonNullable: true,
    });
  }

  initCertificationsControl(
    certificationSelected: string
  ): FormControl<string | null> {
    return this.fb.control<string>(certificationSelected);
  }

  releaseDateValidatorFactory() {
    return (group: AbstractControl): any => {
      let releaseGroup = group as FormGroup<ReleaseDateGroup>;
      let toControl = releaseGroup.controls.to;
      let fromControl = releaseGroup.controls.from;

      if (
        toControl.value &&
        fromControl.value &&
        fromControl.value > toControl.value
      ) {
        fromControl.setErrors({
          invalidFromDate: true,
        });
      } else {
        fromControl.setErrors(null);
      }
      return null;
    };
  }

  onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      let payload: PayloadDiscoveryMovie = this.buildPayload();
      this.payloadEmitterOnSubmit.emit(payload);
    }
  }

  buildPayload(): PayloadDiscoveryMovie {
    return {
      genreIdList: this.buildGenresSelectedListPayload(),
      sortBy: this.buildSortBy(),
      releaseDate: this.buildReleaseDatePayload(),
      includeMediaWithLifecycle: this.buildIncludeLifecyclePayload(),
      certification: this.buildCertification(),
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

  buildCertification(): string {
    return this.filterForm.value?.certifications
      ? this.filterForm.value.certifications
      : '';
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
