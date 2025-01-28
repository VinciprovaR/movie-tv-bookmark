import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MediaType, Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { PersonCardComponent } from '../person-card/person-card.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { NoMediaComponent } from '../no-media/no-media.component';
import { searchType } from '../../interfaces/layout.interface';

@Component({
  selector: 'app-person-list-container',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    NoMediaComponent,
    MatProgressSpinnerModule,
    InfiniteScrollDirective,
    MissingFieldPlaceholderComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './person-list-container.component.html',
})
export class PersonListContainerComponent extends AbstractComponent {
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
  @Input({ required: true })
  searchType!: searchType;
  gridCol: string = '';
  crewIdList: number[] = [];
  searchAdditionalButtonLabel = `Search for additional people`;

  constructor() {
    super();
  }

  discoveryAdditionalPeople() {
    if (this.personList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.personList.length);
    }
  }
}
