import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchFilterComponent } from '../../shared/components/search-filter/search-filter.component';
import { ListContainerComponent } from '../../shared/components/list-container/list-container.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SearchMultiActions, SearchMultiSelectors } from '../../shared/store/search-multi';

@Component({
  selector: 'app-search-multi',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, ListContainerComponent],
  templateUrl: './search-multi.component.html',
  styleUrl: './search-multi.component.css',
})
export class SearchMultiComponent implements OnInit {
  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchMultiSelectors.selectIsLoading
  );

  selectMovie$: Observable<any> = this.store.select(
    SearchMultiSelectors.selectMovies
  );

  constructor(private store: Store) {}
  ngOnInit(): void {

  }

  searchMovie(){
    this.store.dispatch(SearchMultiActions.searchMovie({query:"avengers"}))
  }
}
