import { Directive, inject, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from './abstract-component.component';
import { IMG_SIZES } from '../../../providers';

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
