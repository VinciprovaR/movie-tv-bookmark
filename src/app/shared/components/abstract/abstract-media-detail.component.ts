import { DestroyRef, Directive, inject } from '@angular/core';
import { FastAverageColorResult } from 'fast-average-color';
import { delay, Subject, takeUntil } from 'rxjs';
import { PredominantImgColorService } from '../../services/predominant-img-color.service';
import { AbstractComponent } from './abstract-component.component';
import { IMG_SIZES } from '../../../providers';

@Directive()
export abstract class AbstractMediaDetailComponent extends AbstractComponent {
  readonly predominantImgColorService = inject(PredominantImgColorService);
  readonly TMDB_PROFILE_1X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_1X_IMG_URL);
  readonly TMDB_PROFILE_2X_IMG_URL = inject(IMG_SIZES.TMDB_PROFILE_2X_IMG_URL);
  readonly TMDB_MULTI_FACE_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_MULTI_FACE_1X_IMG_URL
  );
  readonly TMDB_MULTI_FACE_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_MULTI_FACE_2X_IMG_URL
  );
  readonly TMDB_ORIGINAL_IMG_URL = inject(IMG_SIZES.TMDB_ORIGINAL_IMG_URL);

  headerMediaGradient: string = '';
  contentMediaGradient: string = '';
  textColorBlend: string = '';
  isDark: boolean = false;

  constructor() {
    super();
  }

  evaluatePredominantColor(backdropPath: string) {
    if (backdropPath) {
      this.predominantImgColorService
        .evaluatePredominantColor(backdropPath)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (colorResult: FastAverageColorResult) => {
            this.isDark = colorResult.isDark;
            this.headerMediaGradient = this.getHeaderMediaGradient(
              colorResult.value
            );

            this.contentMediaGradient = this.getContentMediaGradient(
              colorResult.value
            );
            this.textColorBlend = this.getTextColorBlend(colorResult.isDark);
            this.detectChanges();
          },
          error: (err) => {
            this.isDark = false;
            this.headerMediaGradient = this.contentMediaGradient =
              this.getDefaultColorGradient();

            this.textColorBlend = this.getTextColorBlend(false);
            this.detectChanges();
          },
        });
    } else {
      this.isDark = false;
      this.headerMediaGradient = this.contentMediaGradient =
        this.getDefaultColorGradient();

      this.textColorBlend = this.getTextColorBlend(false);
      this.detectChanges();
    }
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
