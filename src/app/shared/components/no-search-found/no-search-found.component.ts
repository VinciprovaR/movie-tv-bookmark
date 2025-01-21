import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-no-search-found',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './no-search-found.component.html',
})
export class NoSearchFoundComponent extends AbstractComponent {
  @Input({ required: true })
  title: string = '';
  @Input({ required: true })
  caption: string = '';
  @Input({ required: true })
  icon!: string;

  constructor() {
    super();
  }
}
