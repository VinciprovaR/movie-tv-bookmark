import { Directive, Input } from '@angular/core';
import { AbstractComponent } from './abstract-component.component';
import { takeUntil } from 'rxjs';

@Directive()
export abstract class AbstractCardComponent extends AbstractComponent {
  @Input()
  direction: 'horizontal' | 'vertical' = 'vertical';

  borderImgClassDefault: string = 'border-img-card';
  borderImgClassSm: string = 'border-img-card-sm';
  borderImgClass: string = '';
  borderBookmarkLabelClass: string = '';

  constructor() {
    super();
  }

  evaluateCustomClasses(windowWidth: number) {
    if (this.direction === 'vertical') {
      if (windowWidth >= 510) {
        this.borderImgClass = this.borderImgClassDefault;
        this.borderBookmarkLabelClass = '';
        this.detectChanges();
      } else {
        this.borderImgClass = this.borderImgClassSm;
        this.borderBookmarkLabelClass = 'border-bookmark-label-card-sm';
        this.detectChanges();
      }
    }
  }
}
