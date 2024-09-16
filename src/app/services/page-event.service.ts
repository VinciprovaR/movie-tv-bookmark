import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  fromEvent,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageEventService {
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
