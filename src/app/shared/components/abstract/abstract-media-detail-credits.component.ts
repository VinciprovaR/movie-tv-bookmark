import { Directive, inject } from '@angular/core';
import { AbstractComponent } from './abstract-component.component';
import { IMG_SIZES } from '../../../providers';

@Directive()
export abstract class AbstractMediaDetailCreditsComponent extends AbstractComponent {
  readonly TMDB_LOGO_SIZE_IMG = inject(IMG_SIZES.TMDB_LOGO_SIZE_IMG);
  readonly TMDB_W_300_IMG_URL = inject(IMG_SIZES.TMDB_W_300_IMG_URL);
  readonly TMDB_MULTI_FACE_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_MULTI_FACE_1X_IMG_URL
  );

  constructor() {
    super();
  }
}
