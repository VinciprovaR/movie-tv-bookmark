//

import { DestroyRef, inject, Injectable, signal } from '@angular/core';
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
  $windowInnerWidth = signal(window.innerWidth);
  $windowInnerHeight = signal(window.innerHeight);

  resize$!: Observable<any>;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    this.initSubscription();
  }

  initSubscription() {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroyed$), debounceTime(50))
      .subscribe(() => {
        this.$windowInnerWidth.set(window.innerWidth);
        this.$windowInnerHeight.set(window.innerHeight);
      });
  }
}
