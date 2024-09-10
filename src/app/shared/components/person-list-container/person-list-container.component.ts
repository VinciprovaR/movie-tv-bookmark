import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { ChangeDetectionStrategy } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListContainerComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
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
  @Input()
  @Input()
  placeholder!: string;

  gridCol: string = '';
  crewIdList: number[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.placeholder = `No people were found that match your query.`;
  }
  ngAfterViewInit(): void {}

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  discoveryAdditionalPeople() {
    if (this.personList.length && !this.noAdditional) {
      this.emitDiscoveryAdditionalMedia.emit(this.personList.length);
    }
  }
}
