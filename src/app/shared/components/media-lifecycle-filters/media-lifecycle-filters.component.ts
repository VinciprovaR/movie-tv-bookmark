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
import { GenreFilterComponent } from '../genre-filter/genre-filter.component';
import { SelectFilterComponent } from '../select-filter/select-filter.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';

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
export class MediaLifecycleFiltersComponent implements OnInit {
  readonly fb = inject(FormBuilder);

  destroyed$ = new Subject();

  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  combinedLifecycleFilters$!: Observable<[PayloadMediaLifecycle, Genre[]]>;

  @Output()
  payloadEmitterOnSubmit = new EventEmitter<PayloadMediaLifecycle>();

  filterForm!: FormGroup<LifecycleMediaFilterForm>;

  @Input({ required: true })
  sortBySelect!: OptionFilter[];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.combinedLifecycleFilters$
      .pipe(
        takeUntil(this.destroyed$),
        filter((formData) => formData[1].length > 0)
      )
      .subscribe((formData) => {
        const [filterSelected, genreList] = formData;
        this.buildForm(filterSelected, genreList);
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

  buildForm(filterSelected: PayloadMediaLifecycle, genreList: Genre[]): void {
    this.filterForm = this.fb.group<LifecycleMediaFilterForm>({
      genres: this.initGenreGroup(filterSelected.genreIdList, genreList),
      sortBy: this.initSortByControl(filterSelected.sortBy),
    });
  }

  onSubmit(): void {
    // console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      let payload: PayloadMediaLifecycle = this.buildPayload();
      this.payloadEmitterOnSubmit.emit(payload);
    }
  }

  buildPayload() {
    return {
      genreIdList: this.buildGenresSelectedListPayload(
        this.filterForm.controls.genres
      ),
      sortBy: this.buildSortByPayload(this.filterForm.controls.sortBy),
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
