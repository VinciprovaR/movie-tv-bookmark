import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-missing-field-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './missing-field-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissingFieldPlaceholderComponent extends AbstractComponent {
  @Input({ required: true })
  caption: string = '';

  constructor() {
    super();
  }
}
