import { DestroyRef, inject, Injectable } from '@angular/core';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { from, Observable, of, Subject, takeUntil } from 'rxjs';
import { IMG_SIZES } from '../providers';

@Injectable({ providedIn: 'root' })
export class PredominantImgColorService {
  private readonly destroyRef$ = inject(DestroyRef);
  destroyed$ = new Subject();
  fac: FastAverageColor = new FastAverageColor();
  readonly TMDB_DETAIL_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_DETAIL_LIST_1X_IMG_URL
  );

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  evaluatePredominantColor(imgSrc: string): Observable<FastAverageColorResult> {
    if (imgSrc) {
      return from(
        this.fac.getColorAsync(`${this.TMDB_DETAIL_LIST_1X_IMG_URL}${imgSrc}`, {
          algorithm: 'dominant',
        })
      );
    }
    return of({
      hex: '#000000',
      hexa: '#000000ff',
      isDark: false,
      isLight: true,
      rgb: 'rgb(255,255,255)',
      rgba: 'rgba(255,255,255,255)',
      value: [255, 255, 255, 255],
    });
  }
}
