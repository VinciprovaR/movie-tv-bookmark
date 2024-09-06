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

  private window$ = new BehaviorSubject<Window>(window);
  resizeEvent$ = this.window$.asObservable();
  windowInnerWidth$!: Observable<number>;

  resize$!: Observable<any>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    this.initSelectors();
  }
  // , debounceTime(500)
  initSelectors() {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroyed$), debounceTime(150))
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
