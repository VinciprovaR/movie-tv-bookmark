import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListType } from '../../interfaces/list-type.type';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';

import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';

@Component({
  selector: 'app-person-list-container',
  standalone: true,
  imports: [CommonModule, PersonCardComponent, CastCrewCardComponent],
  templateUrl: './person-list-container.component.html',
  styleUrl: './person-list-container.component.css',
})
export class PersonListContainerComponent implements OnInit {
  @Input()
  isLoading: boolean = false;
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

  constructor() {}
  ngOnInit(): void {
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;
    this.placeholder = `No people were found that match your query.`;
  }
}
