import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  SearchTVActions,
  SearchTVSelectors,
} from '../../shared/store/search-tv';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';

import { MediaType, TV, TVResult } from '../../shared/models/media.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tv-search',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
  ],
  templateUrl: './tv-search.component.html',
  styleUrl: './tv-search.component.css',
})
export class TVSearchComponent implements OnInit {
  mediaType: MediaType = 'tv';

  selectIsLoading$: Observable<boolean> = this.store.select(
    SearchTVSelectors.selectIsLoading
  );

  selectTVResult$: Observable<TVResult> = this.store.select(
    SearchTVSelectors.selectTVResult
  );

  tv$: Observable<TV[]> = this.selectTVResult$.pipe(
    map((tvResult) => {
      return tvResult.results;
    })
  );

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {}

  searchTV(query: string) {
    this.store.dispatch(SearchTVActions.searchTV({ query }));
  }

  searchAdditionalTV() {
    this.store.dispatch(SearchTVActions.searchAdditionalTV());
  }
}
