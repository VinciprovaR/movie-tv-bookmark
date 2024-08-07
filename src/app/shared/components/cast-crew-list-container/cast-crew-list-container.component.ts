import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Cast, Crew } from '../../interfaces/TMDB/tmdb-media.interface';

import { PersonCardComponent } from '../person-card/person-card.component';
import { CastCrewCardComponent } from '../cast-crew-card/cast-crew-card.component';

@Component({
  selector: 'app-cast-crew-list-container',
  standalone: true,
  imports: [CommonModule, PersonCardComponent, CastCrewCardComponent],
  templateUrl: './cast-crew-list-container.component.html',
  styleUrl: './cast-crew-list-container.component.css',
})
export class CastCrewListContainerComponent implements OnInit {
  @Input()
  isLoading: boolean = false;
  @Input({ required: true })
  castCrewList: Cast[] | Crew[] = [];

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
  }
}
