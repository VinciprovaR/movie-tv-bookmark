import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchFilterComponent } from '../../shared/components/search-filter/search-filter.component';
import { ListContainerComponent } from '../../shared/components/list-container/list-container.component';
import { Store } from '@ngrx/store';
import { Observable, defaultIfEmpty } from 'rxjs';
import {
  SearchMovieActions,
  SearchMovieSelectors,
} from '../../shared/store/search-movie';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
@Component({
  selector: 'app-search-multi',
  standalone: true,
  imports: [
    CommonModule,
    SearchFilterComponent,
    ListContainerComponent,
    ScrollNearEndDirective,
  ],
  templateUrl: './search-multi.component.html',
  styleUrl: './search-multi.component.css',
})
export class SearchMultiComponent implements OnInit {
  query: string = '';

  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchMovieSelectors.selectIsLoading
  );

  constructor(private store: Store) {}
  ngOnInit(): void {}

  searchMulti(query: string) {
    this.query = query;
    console.log('searchMulti: ' + query);
    this.store.dispatch(SearchMovieActions.searchMovie({ query }));
  }

  searchAdditionalMulti() {
    console.log('searchadditionalMulti: ' + this.query);

    this.store.dispatch(SearchMovieActions.searchAdditionalMovie());
  }
}
