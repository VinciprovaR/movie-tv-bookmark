import { Component, Input } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [],
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterSuccessComponent {
  @Input('email') email?: string;
}
