import { Directive, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Genre } from '../../interfaces/TMDB/tmdb-filters.interface';
import { AbstractFilter } from './abstract-filter.component';

@Directive()
export abstract class AbstractBookmarkFilters<
  T1,
  T2 extends { [K in keyof T2]: AbstractControl<any, any> }
> extends AbstractFilter<T1, T2> {
  @Input({ required: true })
  combinedBookmarkFilters$!: Observable<[T1, Genre[]]>;

  constructor() {
    super();
  }
}
