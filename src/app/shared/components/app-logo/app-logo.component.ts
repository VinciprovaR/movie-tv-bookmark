import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './app-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent extends AbstractComponent {
  constructor() {
    super();
  }
}
