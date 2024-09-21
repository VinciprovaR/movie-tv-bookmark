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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';
import { PersonCardComponent } from '../person-card/person-card.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-person-list-container',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    CastCrewCardComponent,
    NoSearchFoundComponent,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MissingFieldPlaceholderComponent,
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
  @Input()
  noAdditional: boolean = false;
  @Input({ required: true })
  personList!: Person[];
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
