import { DestroyRef, inject, Injectable } from '@angular/core';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { BehaviorSubject, from, Subject, takeUntil } from 'rxjs';
import { IMG_SIZES } from '../providers';
import { PredominantColor } from '../shared/interfaces/layout.interface';

/**
 * PredominantImgColorService evaluate the predominant color of
 * a selected image and use it as gradient.
 *
 */
@Injectable({ providedIn: 'root' })
export class PredominantImgColorService {
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly destroyed$ = new Subject();
  private readonly getPredominantColor$ = new BehaviorSubject<PredominantColor>(
    {
      headerMediaGradient: '',
      isDark: false,
      textColorBlend: '',
      contentMediaGradient: '',
    }
  );
  getPredominantColorObs$ = this.getPredominantColor$.asObservable();
  fac: FastAverageColor = new FastAverageColor();
  readonly TMDB_EVAL_COLOR_92W_IMG_URL = inject(
    IMG_SIZES.TMDB_EVAL_COLOR_92W_IMG_URL
  );

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  evaluatePredominantColor(backdropPath: string): void {
    let contentMediaGradient = '';
    let headerMediaGradient = '';
    let isDark = false;
    let textColorBlend = '';
    if (backdropPath) {
      from(
        this.fac.getColorAsync(
          `${this.TMDB_EVAL_COLOR_92W_IMG_URL}${backdropPath}`,
          {
            algorithm: 'simple',
          }
        )
      )
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (colorResult: FastAverageColorResult) => {
            isDark = colorResult.isDark;
            headerMediaGradient = this.getHeaderMediaGradient(
              colorResult.value
            );
            contentMediaGradient = this.getContentMediaGradient(
              colorResult.value
            );
            textColorBlend = this.getTextColorBlend(colorResult.isDark);
            this.getPredominantColor$.next({
              headerMediaGradient,
              isDark,
              textColorBlend,
              contentMediaGradient,
            });
          },
          error: (err) => {
            isDark = true;
            headerMediaGradient = this.getDefaultColorGradient();
            contentMediaGradient = this.getDefaultColorGradient();
            textColorBlend = this.getTextColorBlend(isDark);
            this.getPredominantColor$.next({
              headerMediaGradient,
              isDark,
              textColorBlend,
              contentMediaGradient,
            });
          },
        });
    } else {
      isDark = true;
      headerMediaGradient = this.getDefaultColorGradient();
      contentMediaGradient = this.getDefaultColorGradient();
      textColorBlend = this.getTextColorBlend(isDark);
      this.getPredominantColor$.next({
        headerMediaGradient,
        isDark,
        textColorBlend,
        contentMediaGradient,
      });
    }
  }

  getDefaultColorGradient() {
    return `linear-gradient(to bottom, rgba(${103},${108},${128}, ${255}), rgba(${103},${108},${128}, ${255}))`;
  }

  getHeaderMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${0.8}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${0.7}))`;
    // return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
    //   rgbaValue[2]
    // }, ${0.05}), var(--theme-color-1))`;
  }

  getContentMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${1}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${1}))`;
  }

  getTextColorBlend(isDark: boolean) {
    if (isDark) {
      return 'var(--text-color-light) !important';
    }
    return 'var(--text-color-dark) !important';
  }
}
