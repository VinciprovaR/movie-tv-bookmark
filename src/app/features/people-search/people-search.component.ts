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

import { Person } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { BridgeDataService } from '../../shared/services/bridge-data.service';
import { PersonListContainerComponent } from '../../shared/components/person-list-container/person-list-container.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-search-people',
  standalone: true,
  imports: [
    CommonModule,
    InputQueryComponent,
    MediaListContainerComponent,
    PersonListContainerComponent,
    InfiniteScrollModule,
  ],
  providers: [BridgeDataService],
  templateUrl: './people-search.component.html',
  styleUrl: './people-search.component.css',
})
export class PeopleSearchComponent extends AbstractComponent implements OnInit {
  protected readonly bridgeDataService = inject(BridgeDataService);

  title = 'People Search';

  peopleListLength: number = 0;

  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectPeopleList$!: Observable<Person[]>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
  }

  override initSelectors() {
    this.selectQuery$ = this.store.select(SearchPeopleSelectors.selectQuery);
    this.selectIsLoading$ = this.store.select(
      SearchPeopleSelectors.selectIsLoading
    );
    this.selectPeopleList$ = this.store.select(
      SearchPeopleSelectors.selectPeopleList
    );
  }

  override initSubscriptions(): void {}

  searchPeople(query: string) {
    this.store.dispatch(SearchPeopleActions.searchPeople({ query }));
  }

  searchAdditionalPeople(peopleListLength: number = 0) {
    if (peopleListLength) {
      this.store.dispatch(SearchPeopleActions.searchAdditionalPeople());
    }
  }
}
