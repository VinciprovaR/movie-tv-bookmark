import { Directive, inject, OnInit } from '@angular/core';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';

@Directive()
export abstract class AbstractCard implements OnInit {
  private readonly TMDB_CARD_1X_IMG_URL = inject(TMDB_CARD_1X_IMG_URL);
  private readonly TMDB_CARD_2X_IMG_URL = inject(TMDB_CARD_2X_IMG_URL);

  detailMediaPath: string = '';
  card1or2xImgUrl: string = '';
  //to-do cambiare placeholder
  posterNot1xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';
  posterNot2xFoundImgUrl: string =
    '../../../../assets/images/poster-not-found-test.png';

  abstract ngOnInit(): void;

  abstract buildDetailPath(id: number): void;

  buildCard1or2xImgUrl(img: string) {
    this.card1or2xImgUrl = img
      ? `${this.TMDB_CARD_1X_IMG_URL}${img} 1x, ${this.TMDB_CARD_2X_IMG_URL}${img} 2x`
      : `${this.posterNot1xFoundImgUrl} 1x, ${this.posterNot2xFoundImgUrl} 2x`;
  }
}
