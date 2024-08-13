import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import {
  fromEvent,
  takeUntil,
  debounceTime,
  Subject,
  Observable,
  map,
  BehaviorSubject,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageEventService {
  private readonly zone = inject(NgZone);
  destroyed$ = new Subject();

  window$ = new BehaviorSubject<Window>(window);

  windowInnerWidth$!: Observable<number>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    this.initSelectors();
  }

  initSelectors() {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.window$.next(window);
      });

    this.windowInnerWidth$ = this.window$.pipe(
      map((window: Window) => {
        return window.innerWidth;
      })
    );
  }
}
