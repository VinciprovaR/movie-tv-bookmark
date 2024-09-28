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
  showLogo = true;

  constructor() {
    super();
    this.registerEffects();
  }

  registerEffects() {
    effect(() => {
      this.showLogo = this.pageEventService.$windowInnerWidth() >= 320;
      this.detectChanges();
    });
  }
}
