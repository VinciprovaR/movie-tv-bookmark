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
  selector: 'app-cast-crew-card',
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
  templateUrl: './cast-crew-card.component.html',
  styleUrl: './cast-crew-card.component.css',
})
export class CastCrewCardComponent
  extends AbstractPeopleCardComponent
  implements OnInit
{
  @Input({ required: true })
  castCrew!: Cast | Crew;

  override ngOnInit(): void {
    this.buildDetailPath(this.castCrew.id);
    this.buildCard1or2xImgUrl(this.castCrew.profile_path);
  }

  isCastEntity(cast: object): cast is Cast {
    return (cast as Cast).character !== undefined;
  }

  isCrewEntity(crew: object): crew is Crew {
    return (crew as Crew).job !== undefined;
  }
}
