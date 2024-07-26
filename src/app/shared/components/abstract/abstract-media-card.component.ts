import { Directive, inject, Input, OnInit } from '@angular/core';
import { TMDB_CARD_1X_IMG_URL, TMDB_CARD_2X_IMG_URL } from '../../../providers';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { AbstractCard } from './abstract-card.component';

@Directive()
export abstract class AbstractMediaCard extends AbstractCard {
  @Input({ required: true })
  mediaType!: MediaType;

  lifecycleStatusElement: any;

  constructor() {
    super();
  }

  override buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${id}`
    );
  }

  setLifecycleStatusElement(lifecycleStatusElement: any) {
    this.lifecycleStatusElement = lifecycleStatusElement;
  }

  getVoteIconMetadata(voteAverage: number): { icon: string; color: string } {
    if (voteAverage < 6) {
      return { icon: 'thumb_down_alt', color: 'red' };
    } else {
      return { icon: 'thumb_up_alt', color: 'green' };
    }
  }
}
