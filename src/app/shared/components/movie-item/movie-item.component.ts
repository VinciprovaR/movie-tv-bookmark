import { Component, Inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MediaType,
  Movie,
  TV,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Movie_Data, TV_Data } from '../../interfaces/supabase/entities';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [
    RouterModule,
    LifecycleSelectorComponent,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.css',
})
export class MovieItemComponent implements OnInit {
  @Input({ required: true })
  movieData!: Movie | Movie_Data;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  detailMediaPath: string = '';

  card1or2xImgUrl: string = '';
  //to-do cambiare placeholder
  posterNot1xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';
  posterNot2xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';

  constructor(
    @Inject(TMDB_CARD_1X_IMG_URL) private TMDB_CARD_1X_IMG_URL: string,
    @Inject(TMDB_CARD_2X_IMG_URL) private TMDB_CARD_2X_IMG_URL: string
  ) {}
  ngOnInit(): void {
    this.card1or2xImgUrl = this.movieData.poster_path
      ? `${this.TMDB_CARD_1X_IMG_URL}${this.movieData.poster_path} 1x, ${this.TMDB_CARD_2X_IMG_URL}${this.movieData.poster_path} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;

    this.detailMediaPath = this.detailMediaPath.concat(
      `/movie-detail/${this.movieData.id}`
    );
  }
}
