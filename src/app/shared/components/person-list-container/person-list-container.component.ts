import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { NoSearchFoundComponent } from '../no-search-found/no-search-found.component';

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
