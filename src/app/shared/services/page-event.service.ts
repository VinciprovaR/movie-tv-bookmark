import { DestroyRef, inject, Injectable } from '@angular/core';
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
  destroyed$ = new Subject();
  onResize$!: Observable<Event>;
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
    this.onResize$ = fromEvent(window, 'resize').pipe(
      takeUntil(this.destroyed$),
      debounceTime(50)
    );

    this.onResize$.subscribe(() => {
      this.window$.next(window);
    });

    this.windowInnerWidth$ = this.window$.pipe(
      map((window: Window) => {
        return window.innerWidth;
      })
    );
  }
}
