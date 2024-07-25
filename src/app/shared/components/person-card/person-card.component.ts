import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { Cast, Crew, Person } from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
export class PersonCardComponent implements OnInit {
  private readonly TMDB_CARD_1X_IMG_URL = inject(TMDB_CARD_1X_IMG_URL);
  private readonly TMDB_CARD_2X_IMG_URL = inject(TMDB_CARD_2X_IMG_URL);

  @Input({ required: true })
  personData!: Person | Cast | Crew;
  //

  @Input()
  voteAverage!: number;

  voteIcon: string = '';

  detailMediaPath: string = '';

  card1or2xImgUrl: string = '';
  //to-do cambiare placeholder
  posterNot1xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';
  posterNot2xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';

  //to-do refracto

  ngOnInit(): void {
    //to-do person detail
    // this.detailMediaPath = this.detailMediaPath.concat(
    //   `/${this.personType}-detail/${this.personId}`
    // );

    this.card1or2xImgUrl = this.personData.profile_path
      ? `${this.TMDB_CARD_1X_IMG_URL}${this.personData.profile_path} 1x, ${this.TMDB_CARD_2X_IMG_URL}${this.personData.profile_path} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;
  }
}
