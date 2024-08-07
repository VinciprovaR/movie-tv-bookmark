import { DestroyRef, Directive, inject } from '@angular/core';
import { FastAverageColorResult } from 'fast-average-color';
import { Subject, takeUntil } from 'rxjs';
import { PredominantImgColorService } from '../../services/predominant-img-color.service';

@Directive()
export abstract class MediaDetailComponent {
  readonly predominantImgColorService = inject(PredominantImgColorService);
  private readonly destroyRef$ = inject(DestroyRef);
  destroyed$ = new Subject();

  headerMediaGradient: string = '';
  contentMediaGradient: string = '';
  textColorBlend: string = '';
  isDark: boolean = false;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
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
          },
          error: (err) => {
            this.isDark = false;
            this.headerMediaGradient = this.contentMediaGradient =
              this.getDefaultColorGradient();

            this.textColorBlend = this.getTextColorBlend(false);
          },
        });
    } else {
      this.isDark = false;
      this.headerMediaGradient = this.contentMediaGradient =
        this.getDefaultColorGradient();

      this.textColorBlend = this.getTextColorBlend(false);
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
