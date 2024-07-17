import { Component, Inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MediaType, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TV_Data } from '../../interfaces/supabase/entities';

@Component({
  selector: 'app-tv-item',
  standalone: true,
  imports: [
    RouterModule,
    LifecycleSelectorComponent,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './tv-item.component.html',
  styleUrl: './tv-item.component.css',
})
export class TVItemComponent implements OnInit {
  @Input({ required: true })
  tvData!: TV | TV_Data;
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
    this.card1or2xImgUrl = this.tvData.poster_path
      ? `${this.TMDB_CARD_1X_IMG_URL}${this.tvData.poster_path} 1x, ${this.TMDB_CARD_2X_IMG_URL}${this.tvData.poster_path} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;

    this.detailMediaPath = this.detailMediaPath.concat(
      `/tv-detail/${this.tvData.id}`
    );
  }
}
