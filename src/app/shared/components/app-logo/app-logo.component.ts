import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent extends AbstractComponent {
  constructor() {
    super();
  }
}
