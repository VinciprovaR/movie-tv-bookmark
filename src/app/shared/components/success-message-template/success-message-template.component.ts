import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-success-message-template',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './success-message-template.component.html',
})
export class SuccessMessageTemplateComponent extends AbstractComponent {
  @Input({ required: true })
  message!: string;

  constructor() {
    super();
  }
}
