import { Directive, inject } from '@angular/core';
import { IMG_SIZES } from '../../../providers';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractMediaDetailCreditsComponent extends AbstractComponent {
  readonly TMDB_PROFILE_92W_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_92W_IMG_URL
  );

  readonly TMDB_PROFILE_1000W_450H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_1000W_450H_IMG_URL
  );

  constructor() {
    super();
  }
}
