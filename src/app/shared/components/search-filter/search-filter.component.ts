import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { SearchMovieActions } from '../../store/search-movie';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-filter',
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
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css',
})
export class SearchFilterComponent implements OnInit {
  searchControl!: FormControl<string>;
  @Output()
  querySearch: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.searchControl = this.fb.control<string>('', {
      validators: [],
      nonNullable: true,
    });
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((query) => {
        this.querySearch.emit(query);
      });
  }

  ngOnDestroy(): void {
    //to-do check if there are error
    this.store.dispatch(SearchMovieActions.cleanError());
  }
}
