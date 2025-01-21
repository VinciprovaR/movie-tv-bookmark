import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-error-message-template',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './error-message-template.component.html',
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
