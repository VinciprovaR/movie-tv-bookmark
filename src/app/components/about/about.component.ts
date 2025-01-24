import { Component } from '@angular/core';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';
import { ImgComponent } from '../../shared/components/img/img.component';

@Component({
  selector: 'app-about',
  imports: [ImgComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent extends AbstractComponent {}
