import { Directive, Input, OnInit } from '@angular/core';

import { AbstractControl } from '@angular/forms';
import { AbstractFilter } from './abstract-filter.component';
import { Observable } from 'rxjs';
import { Genre } from '../../interfaces/TMDB/tmdb-filters.interface';

@Directive()
export abstract class AbstractLifecycleFilters<
  T1,
  T2 extends { [K in keyof T2]: AbstractControl<any, any> }
> extends AbstractFilter<T1, T2> {
  @Input({ required: true })
  combinedLifecycleFilters$!: Observable<[T1, Genre[]]>;

  constructor() {
    super();
  }
}
