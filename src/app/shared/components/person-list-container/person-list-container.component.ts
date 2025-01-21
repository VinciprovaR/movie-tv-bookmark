import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MediaType, Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';
import { PersonCardComponent } from '../person-card/person-card.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { TypeSuggestionComponent } from '../type-suggestion/type-suggestion.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-person-list-container',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    NoSearchFoundComponent,
    MatProgressSpinnerModule,
    InfiniteScrollDirective,
    MissingFieldPlaceholderComponent,
    TypeSuggestionComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './person-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListContainerComponent
  extends AbstractComponent
  implements OnInit
{
  @ViewChildren('crewCast')
  castCrewCardComponentList!: QueryList<CastCrewCardComponent>;
  @Output()
  emitDiscoveryAdditionalMedia = new EventEmitter<number>();
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  noAdditional: boolean = false;
  @Input({ required: true })
  personList!: Person[];
  @Input()
  query!: string;
  titleNotFound!: string;
  captionNotFound!: string;
  gridCol: string = '';
  crewIdList: number[] = [];
  searchAdditionalButtonLabel = `Search for additional people`;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.captionNotFound = ` We couldn't find any person matching your search. Try searching with different keywords`;
    this.titleNotFound = `No person found`;
  }

  discoveryAdditionalPeople() {
    if (this.personList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.personList.length);
    }
  }
}
