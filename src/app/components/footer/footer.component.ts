import { Component } from '@angular/core';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent extends AbstractComponent {
  constructor() {
    super();
  }
}
