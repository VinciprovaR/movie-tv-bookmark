import { DestroyRef, inject, Injectable } from '@angular/core';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { from, Observable, of, Subject, takeUntil } from 'rxjs';
import { IMG_SIZES } from '../../providers';

@Injectable({ providedIn: 'root' })
export class PredominantImgColorService {
  private readonly destroyRef$ = inject(DestroyRef);
  destroyed$ = new Subject();
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
  // ${this.TMDB_PROFILE_92W_IMG_URL}${imgSrc}
  evaluatePredominantColor(imgSrc: string): Observable<FastAverageColorResult> {
    return from(
      this.fac.getColorAsync(`${this.TMDB_PROFILE_92W_IMG_URL}${imgSrc}`, {
        algorithm: 'simple',
      })
    );
  }
}
