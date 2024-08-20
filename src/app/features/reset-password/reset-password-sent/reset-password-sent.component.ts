import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-reset-password-sent',
  standalone: true,
  imports: [],
  templateUrl: './reset-password-sent.component.html',
  styleUrl: './reset-password-sent.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordSentComponent extends AbstractComponent {
  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
