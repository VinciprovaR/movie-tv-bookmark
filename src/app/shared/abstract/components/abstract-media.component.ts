import { Directive } from '@angular/core';
import { AbstractComponent } from './abstract-component.component';
import { filter, map, takeUntil } from 'rxjs';
import { NavigationEnd } from '@angular/router';

@Directive()
export abstract class AbstractMediaComponent extends AbstractComponent {
  mediaTypeLbl: string = '';

  constructor() {
    super();
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event) => event instanceof NavigationEnd),
        map((event: any) => event.urlAfterRedirects)
      )
      .subscribe((url: string) => {
        if (url.includes('movie')) {
          this.mediaTypeLbl = 'Movies';
        } else if (url.includes('tv')) {
          this.mediaTypeLbl = 'TV Shows';
        } else if (url.includes('people')) {
          this.mediaTypeLbl = 'People';
        }
      });
  }
}
