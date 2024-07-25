import { Component, Input, OnInit } from '@angular/core';
import { PersonCardComponent } from '../person-card/person-card.component';
import { Person } from '../../interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-people-item',
  standalone: true,
  imports: [PersonCardComponent],
  templateUrl: './people-item.component.html',
  styleUrl: './people-item.component.css',
})
export class PeopleItemComponent {
  @Input({ required: true })
  person!: Person;

  constructor() {}
}
