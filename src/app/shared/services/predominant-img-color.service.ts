import { DestroyRef, inject, Injectable } from '@angular/core';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { BehaviorSubject, from, Subject, takeUntil } from 'rxjs';
import { IMG_SIZES } from '../../providers';
import { PredominantColor } from '../interfaces/layout.interface';

/**
 * PredominantImgColorService evaluate the predominant color of
 * a selected image and use it as grdient.
 *
 */
@Injectable({ providedIn: 'root' })
export class PredominantImgColorService {
  private readonly destroyRef$ = inject(DestroyRef);
  private destroyed$ = new Subject();
  private getPredominantColor$ = new BehaviorSubject<PredominantColor>({
    headerMediaGradient: '',
    isDark: false,
    textColorBlend: '',
  });
  getPredominantColorObs$ = this.getPredominantColor$.asObservable();
  fac: FastAverageColor = new FastAverageColor();
  readonly TMDB_PROFILE_92W_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_92W_IMG_URL
  );

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  evaluatePredominantColor(backdropPath: string): void {
    let headerMediaGradient = '';
    let isDark = false;
    let textColorBlend = '';
    if (backdropPath) {
      from(
        this.fac.getColorAsync(
          `${this.TMDB_PROFILE_92W_IMG_URL}${backdropPath}`,
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
            textColorBlend = this.getTextColorBlend(colorResult.isDark);
            this.getPredominantColor$.next({
              headerMediaGradient,
              isDark,
              textColorBlend,
            });
          },
          error: (err) => {
            isDark = false;
            headerMediaGradient = this.getDefaultColorGradient();
            textColorBlend = this.getTextColorBlend(false);
            this.getPredominantColor$.next({
              headerMediaGradient,
              isDark,
              textColorBlend,
            });
          },
        });
    } else {
      isDark = false;
      headerMediaGradient = this.getDefaultColorGradient();
      textColorBlend = this.getTextColorBlend(false);
      this.getPredominantColor$.next({
        headerMediaGradient,
        isDark,
        textColorBlend,
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
  }

  getTextColorBlend(isDark: boolean) {
    if (isDark) {
      return 'var(--text-color-light) !important';
    }
    return 'var(--text-color-dark) !important';
  }
}
