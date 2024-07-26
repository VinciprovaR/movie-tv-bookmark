import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { Cast, Crew, Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractCard } from '../abstract/abstract-card.component';
import { AbstractPeopleCardComponent } from '../abstract/abstract-people-card.component';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    LifecycleSelectorComponent,
    RouterModule,
    PercentPipe,
    MatIconModule,
  ],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css',
})
export class PersonCardComponent
  extends AbstractPeopleCardComponent
  implements OnInit
{
  @Input({ required: true })
  person!: Person;

  override ngOnInit(): void {
    this.buildDetailPath(this.person.id);
    this.buildCard1or2xImgUrl(this.person.profile_path);
  }

  isPersonEntity(person: object): person is Person {
    return (person as Person).known_for !== undefined;
  }
}
