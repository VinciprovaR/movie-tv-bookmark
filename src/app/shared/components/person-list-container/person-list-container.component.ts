import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListType } from '../../interfaces/list-type.type';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';

import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-person-list-container',
  standalone: true,
  imports: [
    CommonModule,
    PersonCardComponent,
    CastCrewCardComponent,
    MissingFieldPlaceholderComponent,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
  ],
  templateUrl: './person-list-container.component.html',
  styleUrl: './person-list-container.component.css',
})
export class PersonListContainerComponent
  extends AbstractComponent
  implements OnInit
{
  @Output()
  emitDiscoveryAdditionalMedia = new EventEmitter<number>();
  @Input()
  isLoading: boolean = false;
  @Input()
  noAdditional: boolean = false;
  @Input({ required: true })
  personList!: Person[];
  @Input()
  @Input()
  placeholder!: string;
  @Input()
  minMaxCol: number = 160;

  gridCol: string = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

  crewIdList: number[] = [];

  @ViewChildren('crewCast')
  castCrewCardComponentList!: QueryList<CastCrewCardComponent>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;
    this.placeholder = `No people were found that match your query.`;
  }
  override initSelectors(): void {}
  override initSubscriptions(): void {}

  discoveryAdditionalPeople() {
    if (this.personList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.personList.length);
    }
  }
}
