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
import { Cast, Crew, Person } from '../../interfaces/TMDB/tmdb-media.interface';

import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';

@Component({
  selector: 'app-people-list-container',
  standalone: true,
  imports: [CommonModule, PersonCardComponent, CastCrewCardComponent],
  templateUrl: './people-list-container.component.html',
  styleUrl: './people-list-container.component.css',
})
export class PeopleListContainerComponent implements OnInit {
  @Input()
  isLoading: boolean = false;
  @Input()
  personList!: Person[];
  @Input()
  castList!: Cast[];
  @Input()
  crewList!: Crew[];
  @Input()
  placeholder!: string;
  @Input()
  minMaxCol: number = 160;

  gridCol: string = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;

  crewIdList: number[] = [];

  crewUniqueMap: Map<number, Crew> = new Map<number, Crew>();

  @ViewChildren('crewCast')
  castCrewCardComponentList!: QueryList<CastCrewCardComponent>;

  constructor() {}
  ngOnInit(): void {
    this.gridCol = `grid-cols-[repeat(auto-fill,_minmax(${this.minMaxCol}px,_1fr))]`;
    this.placeholder = `No people were found that match your query.`;
    if (this.crewList) {
      this.prepareCrewList();
    }
  }

  prepareCrewList() {
    this.crewList.forEach((crew: Crew) => {
      if (!this.crewUniqueMap.has(crew.id)) {
        this.crewUniqueMap.set(crew.id, crew);
      }
    });
  }

  get sliceUniqueMapCrew(): Map<number, Crew> {
    const arrayTmp = Array.from(this.crewUniqueMap).slice(0, 6);
    return new Map(arrayTmp);
  }
}
