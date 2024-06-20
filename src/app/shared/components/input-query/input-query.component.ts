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
import { SearchMovieActions } from '../../store/search-media';
import { Store } from '@ngrx/store';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  skipWhile,
  tap,
} from 'rxjs';
import { SearchMovieSelectors } from '../../store/search-media';

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

  query$ = this.store.select(SearchMovieSelectors.selectQuery);

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    //to-do check if there are error
    this.store.dispatch(SearchMovieActions.cleanError());
  }
}
