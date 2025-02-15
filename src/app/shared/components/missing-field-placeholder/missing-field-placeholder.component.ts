import { Component, Input } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-missing-field-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './missing-field-placeholder.component.html',
})
export class MissingFieldPlaceholderComponent extends AbstractComponent {
  @Input({ required: true })
  caption: string = '';

  constructor() {
    super();
  }
}
