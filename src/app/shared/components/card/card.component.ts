import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';
import {
  Movie,
  MediaType,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    LifecycleSelectorComponent,
    RouterModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  private readonly TMDB_CARD_1X_IMG_URL = inject(TMDB_CARD_1X_IMG_URL);
  private readonly TMDB_CARD_2X_IMG_URL = inject(TMDB_CARD_2X_IMG_URL);

  @Input({ required: true })
  mediaData!: Movie | Movie_Data | TV | TV_Data;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;
  @Input({ required: true })
  detailMediaPath!: string;
  @Input({ required: true })
  release_date!: string;
  @Input({ required: true })
  title!: string;

  card1or2xImgUrl: string = '';
  //to-do cambiare placeholder
  posterNot1xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';
  posterNot2xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';

  ngOnInit(): void {
    this.card1or2xImgUrl = this.mediaData.poster_path
      ? `${this.TMDB_CARD_1X_IMG_URL}${this.mediaData.poster_path} 1x, ${this.TMDB_CARD_2X_IMG_URL}${this.mediaData.poster_path} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;
  }
}
