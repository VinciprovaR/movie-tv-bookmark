import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { InputQueryComponent } from '../../shared/components/input-query/input-query.component';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  SearchPeopleActions,
  SearchPeopleSelectors,
} from '../../shared/store/search-people';
import { ScrollNearEndDirective } from '../../shared/directives/scroll-near-end.directive';
import { Person } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PeopleListContainerComponent } from '../../shared/components/people-list-container/people-list-container.component';

@Component({
  selector: 'app-search-people',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    ScrollNearEndDirective,
    PeopleListContainerComponent,
  ],
  providers: [BridgeDataService],
  templateUrl: './people-search.component.html',
  styleUrl: './people-search.component.css',
})
export class PeopleSearchComponent implements OnInit {
  title = 'People Search';

  peopleListLength: number = 0;
  destroyed$ = new Subject();

  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectPeopleList$!: Observable<Person[]>;

  constructor(
    private store: Store,
    private bridgeDataService: BridgeDataService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.initSelectors();
  }

  initSelectors() {
    this.selectQuery$ = this.store.select(SearchPeopleSelectors.selectQuery);
    this.selectIsLoading$ = this.store.select(
      SearchPeopleSelectors.selectIsLoading
    );
    this.selectPeopleList$ = this.store.select(
      SearchPeopleSelectors.selectPeopleList
    );
  }

  searchPeople(query: string) {
    this.store.dispatch(SearchPeopleActions.searchPeople({ query }));
  }

  searchAdditionalPeople(peopleListLength: number = 0) {
    if (peopleListLength) {
      this.store.dispatch(SearchPeopleActions.searchAdditionalPeople());
    }
  }
}
