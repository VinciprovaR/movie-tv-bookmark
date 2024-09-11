import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-message-template',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './error-message-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageTemplateComponent extends AbstractComponent {
  @Input({ required: true })
  message!: string;
  @Input({ required: true })
  title!: string;

  constructor() {
    super();
  }
}
