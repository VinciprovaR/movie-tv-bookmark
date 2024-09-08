import { Directive, Input } from '@angular/core';
import { AbstractComponent } from './abstract-component.component';
import { takeUntil } from 'rxjs';
import { scrollDirection } from '../../interfaces/layout.types';

@Directive()
export abstract class AbstractCardComponent extends AbstractComponent {
  @Input({ required: true })
  direction: scrollDirection = 'none';

  borderImgClassDefault: string = 'border-img-card';
  borderImgClassSm: string = 'border-img-card-sm';
  borderImgClass: string = '';
  borderBookmarkLabelClass: string = '';

  constructor() {
    super();
  }

  evaluateCustomClasses(windowWidth: number) {
    if (windowWidth >= 510) {
      this.borderBookmarkLabelClass = '';
      this.borderImgClass = this.borderImgClassDefault;
      this.detectChanges();
    } else {
      if (this.direction === 'vertical') {
        this.borderImgClass = this.borderImgClassSm;
      } else {
        this.borderImgClass = this.borderImgClassDefault;
      }

      this.borderBookmarkLabelClass = 'border-bookmark-label-card-sm';
      this.detectChanges();
    }
  }
}
