import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-success-message-template',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './success-message-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessMessageTemplateComponent extends AbstractComponent {
  @Input({ required: true })
  message!: string;

  constructor() {
    super();
  }
}
