import { DestroyRef, inject, Injectable } from '@angular/core';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { from, Observable, of, Subject, takeUntil } from 'rxjs';
import { IMG_SIZES } from '../../providers';

@Injectable({ providedIn: 'root' })
export class PredominantImgColorService {
  private readonly destroyRef$ = inject(DestroyRef);
  destroyed$ = new Subject();
  fac: FastAverageColor = new FastAverageColor();
  readonly TMDB_DETAIL_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_DETAIL_LIST_1X_IMG_URL
  );
  readonly TMDB_LOGO_SIZE_IMG = inject(IMG_SIZES.TMDB_LOGO_SIZE_IMG);

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }
  // ${this.TMDB_LOGO_SIZE_IMG}${imgSrc}
  evaluatePredominantColor(imgSrc: string): Observable<FastAverageColorResult> {
    return from(
      this.fac.getColorAsync(`${this.TMDB_LOGO_SIZE_IMG}${imgSrc}`, {
        algorithm: 'simple',
      })
    );
  }
}
