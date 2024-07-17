import { Component, Inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cast } from '../../interfaces/TMDB/tmdb-media.interface';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-people-item',
  standalone: true,
  imports: [
    RouterModule,
    LifecycleSelectorComponent,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './people-item.component.html',
  styleUrl: './people-item.component.css',
})
export class PeopleItemComponent implements OnInit {
  @Input({ required: true })
  cast!: Cast;

  card1or2xImgUrl: string = '';

  //to-do cambiare placeholder per people
  posterNot1xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';
  posterNot2xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';

  constructor(
    @Inject(TMDB_CARD_1X_IMG_URL) private TMDB_CARD_1X_IMG_URL: string,
    @Inject(TMDB_CARD_2X_IMG_URL) private TMDB_CARD_2X_IMG_URL: string
  ) {}
  ngOnInit(): void {
    this.card1or2xImgUrl = this.cast.profile_path
      ? `${this.TMDB_CARD_1X_IMG_URL}${this.cast.profile_path} 1x, ${this.TMDB_CARD_2X_IMG_URL}${this.cast.profile_path} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;
  }
}
