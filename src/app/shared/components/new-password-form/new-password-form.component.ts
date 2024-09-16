import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

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
