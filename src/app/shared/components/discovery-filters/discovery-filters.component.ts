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
  Genre,
  GenreControl,
  GenreGroup,
} from '../../models/tmdb-filters.models';
import { MediaType } from '../../models/media.models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenreTagComponent } from '../genre-tag/genre-tag.component';

import { PayloadDiscoveryMovie } from '../../models/store/discovery-movie-state.models';

import { GenreFilterComponent } from '../genre-filter/genre-filter.component';
import { OrderByFilterComponent } from '../order-by-filter/order-by-filter.component';

@Component({
  selector: 'app-discovery-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GenreTagComponent,
    GenreFilterComponent,
    OrderByFilterComponent,
  ],
  templateUrl: './discovery-filters.component.html',
  styleUrl: './discovery-filters.component.css',
})
export class DiscoveryFiltersComponent implements OnInit {
  destroyed$ = new Subject();
  filterForm!: FormGroup;

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
    let genresSelected$: Observable<number[]> = this.payload$.pipe(
      map((payload) => {
        return payload.genresSelectedId;
      })
    );

    let sortBySelected$: Observable<string> = this.payload$.pipe(
      map((payload) => {
        return payload.sortBy;
      })
    );

    combineLatest([genresSelected$, this.genreList$, sortBySelected$])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((filterSelected) => {
        this.buildForm(filterSelected);
      });
  }
  //to-do refractorare nello store?
  buildForm(filterSelected: [number[], Genre[], string]): void {
    let [genresSelected, genresList, sortBySelected] = filterSelected;
    let genreGroup: GenreGroup = {};
    genresList.forEach((genre) => {
      genreGroup[genre.id] = this.fb.control<GenreControl>({
        id: genre.id,
        name: genre.name,
        isSelected: genresSelected.indexOf(genre.id) != -1,
      });
    });

    this.filterForm = this.fb.group({
      genres: this.fb.group({ ...genreGroup }),
      sortBy: this.fb.control<string>(sortBySelected),
    });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      let payload: PayloadDiscoveryMovie = this.buildPayload();
      this.payloadEmitter.emit(payload);
    }
  }

  buildPayload(): PayloadDiscoveryMovie {
    return {
      genresSelectedId: this.buildGenresSelectedList(),
      sortBy: this.filterForm.value.sortBy,
    };
  }

  buildGenresSelectedList(): number[] {
    let genresSelectedId: number[] = [];
    Object.entries(this.filterForm.value.genres).forEach((entries) => {
      let [genreId, genre]: [string, any] = entries;
      if (genre.isSelected) {
        genresSelectedId.push(+genreId);
      }
    });
    return genresSelectedId;
  }
}
