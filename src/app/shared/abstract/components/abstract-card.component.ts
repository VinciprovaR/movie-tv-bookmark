import { Directive, Input } from '@angular/core';
import { scrollDirection } from '../../interfaces/layout.interface';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractCardComponent extends AbstractComponent {
  @Input({ required: true })
  direction: scrollDirection = 'none';

  constructor() {
    super();
  }
}
