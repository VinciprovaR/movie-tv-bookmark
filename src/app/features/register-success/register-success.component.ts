import { Component, Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [],
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterSuccessComponent extends AbstractComponent {
  @Input('email') email?: string;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
