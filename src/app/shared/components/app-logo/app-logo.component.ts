import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImgComponent } from '../img/img.component';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent extends AbstractComponent {
  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
