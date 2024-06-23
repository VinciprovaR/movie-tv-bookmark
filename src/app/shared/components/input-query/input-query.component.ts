import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SearchMovieSelectors } from '../../store/search-movie';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  skipWhile,
  tap,
} from 'rxjs';

import { MediaType } from '../../models';

@Component({
  selector: 'app-input-query',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
  ],
  templateUrl: './input-query.component.html',
  styleUrl: './input-query.component.css',
})
export class InputQueryComponent implements OnInit {
  searchControl!: FormControl<string>;

  @Output()
  queryEmitter: EventEmitter<string> = new EventEmitter<string>();

  query$!: Observable<string>;

  @Input({ required: true })
  mediaType!: MediaType;

  placeholder!: string;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    if (this.mediaType === 'movie') {
      this.query$ = this.store.select(SearchMovieSelectors.selectQuery);
    } else if (this.mediaType === 'tv') {
      //this.query$ = this.store.select(SearchTVSelectors.selectQuery);
    }

    this.placeholder =
      this.mediaType === 'movie'
        ? 'Search for a movie'
        : 'Search for a tv show';

    this.searchControl = this.fb.control<string>('', {
      validators: [],
      nonNullable: true,
    });
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        skipWhile((query) => !query),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        this.queryEmitter.emit(query);
      });

    this.query$.subscribe((query) => {
      this.searchControl.setValue(query, { emitEvent: false });
    });
  }
}
