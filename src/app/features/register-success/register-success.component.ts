import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [],
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.css',
})
export class RegisterSuccessComponent {
  @Input('email') email?: string;
}
