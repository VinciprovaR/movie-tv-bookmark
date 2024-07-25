import { Directive, Input, OnInit } from '@angular/core';

import { AbstractControl } from '@angular/forms';
import { Filter } from './filter.abstract';
import { Observable } from 'rxjs';
import { Genre } from '../interfaces/TMDB/tmdb-filters.interface';

@Directive()
export abstract class LifecycleFilters<
  T1,
  T2 extends { [K in keyof T2]: AbstractControl<any, any> }
> extends Filter<T1, T2> {
  @Input({ required: true })
  combinedLifecycleFilters$!: Observable<[T1, Genre[]]>;

  constructor() {
    super();
  }
}
