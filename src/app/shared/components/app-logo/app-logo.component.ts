import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImgComponent } from '../img/img.component';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './app-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent extends AbstractComponent {}
