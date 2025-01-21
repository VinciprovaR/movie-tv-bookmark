import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BridgeDataService } from '../../../../core/services/bridge-data.service';
import {
  SearchPeopleActions,
  SearchPeopleSelectors,
} from '../../../../core/store/search-people';
import { AbstractComponent } from '../../../../shared/abstract/components/abstract-component.component';
import { InputQueryComponent } from '../../../../shared/components/input-query/input-query.component';
import { PersonListContainerComponent } from '../../../../shared/components/person-list-container/person-list-container.component';
import {
  MediaType,
  Person,
} from '../../../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-search-people',
  standalone: true,
  imports: [CommonModule, InputQueryComponent, PersonListContainerComponent],
  providers: [BridgeDataService],
  templateUrl: './people-search.component.html',
})
export class PeopleSearchComponent extends AbstractComponent implements OnInit {
  protected readonly bridgeDataService = inject(BridgeDataService);

  title = 'People Search';
  mediaType: MediaType = 'person';
  peopleListLength: number = 0;
  selectQuery$!: Observable<string>;
  selectIsLoading$!: Observable<boolean>;
  selectPeopleList$!: Observable<Person[]>;
  selectNoAdditional$!: Observable<boolean>;

  constructor() {
    super();
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
    this.selectNoAdditional$ = this.store.select(
      SearchPeopleSelectors.selectNoAdditional
    );
  }

  searchPeople(query: string) {
    this.store.dispatch(SearchPeopleActions.searchPeople({ query }));
  }

  searchAdditionalPeople() {
    this.store.dispatch(SearchPeopleActions.searchAdditionalPeople());
  }
}
