import { Directive, Input } from '@angular/core';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractNavComponent extends AbstractComponent {
  @Input({ required: true })
  isUserAuthenticated: boolean = false;

  constructor() {
    super();
  }
  canRender(needAuth: boolean, onlyNonAuth: boolean = false) {
    if (needAuth) {
      if (this.isUserAuthenticated) {
        return true;
      }
      return false;
    }

    if (onlyNonAuth) {
      if (this.isUserAuthenticated) {
        return false;
      }
      return true;
    }

    return true;
  }
}
