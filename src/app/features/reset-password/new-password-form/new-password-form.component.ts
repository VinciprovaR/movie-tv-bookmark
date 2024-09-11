import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AbstractComponent } from '../../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-new-password-form',
  standalone: true,
  imports: [],
  templateUrl: './new-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPasswordFormComponent extends AbstractComponent {
  constructor() {
    super();
  }
}
