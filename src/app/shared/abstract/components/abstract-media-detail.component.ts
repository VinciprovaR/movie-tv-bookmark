import { Directive, inject } from '@angular/core';
import { IMG_SIZES } from '../../../providers';
import { AbstractComponent } from './abstract-component.component';
import { PredominantImgColorService } from '../../../services/predominant-img-color.service';

@Directive()
export abstract class AbstractMediaDetailComponent extends AbstractComponent {
  readonly predominantImgColorService = inject(PredominantImgColorService);

  readonly W_780_IMG_URL = inject(IMG_SIZES.W_780_IMG_URL);
  readonly W_500_IMG_URL = inject(IMG_SIZES.W_500_IMG_URL);
  readonly TMDB_PROFILE_300W_450H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_300W_450H_IMG_URL
  );
  readonly TMDB_PROFILE_600W_900H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_600W_900H_IMG_URL
  );
  readonly TMDB_PROFILE_1000W_450H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_1000W_450H_IMG_URL
  );
  readonly TMDB_PROFILE_1920W_800H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_1920W_800H_IMG_URL
  );
  readonly TMDB_ORIGINAL_IMG_URL = inject(IMG_SIZES.TMDB_ORIGINAL_IMG_URL);

  headerMediaGradient: string = '';
  contentMediaGradient: string = '';
  textColorBlend: string = '';
  isDark: boolean = false;

  constructor() {
    super();
  }

  getHeaderMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${0.9}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${0.8}))`;
  }

  getContentMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${1}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${1}))`;
  }

  getDefaultColorGradient() {
    return `linear-gradient(to bottom, rgba(${103},${108},${128}, ${255}), rgba(${103},${108},${128}, ${255}))`;
  }

  getTextColorBlend(isDark: boolean) {
    if (isDark) {
      return 'var(--text-color-light) !important';
    }
    return 'var(--text-color-dark) !important';
  }
}
