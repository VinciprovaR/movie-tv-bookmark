import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../components/abstract/abstract-component.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent extends AbstractComponent {
  constructor() {
    super();
  }
}
