import { Directive, inject, Input, OnInit } from '@angular/core';

import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { IMG_SIZES } from '../../../providers';

@Directive()
export abstract class AbstractMediaCard {
  protected readonly TMDB_SEARCH_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_1X_IMG_URL
  );
  protected readonly TMDB_SEARCH_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_2X_IMG_URL
  );

  @Input({ required: true })
  mediaType!: MediaType;

  detailMediaPath: string = '';

  lifecycleStatusElement: any;

  constructor() {}

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${id}`
    );
  }

  setLifecycleStatusElement(lifecycleStatusElement: any) {
    this.lifecycleStatusElement = lifecycleStatusElement;
  }
}
