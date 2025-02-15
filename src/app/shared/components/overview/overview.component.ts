import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent],
  templateUrl: './overview.component.html',
})
export class OverviewComponent extends AbstractComponent {
  @Input({ required: true })
  tagline!: string;

  @Input({ required: true })
  overview!: string;

  @Input({ required: true })
  isDark: boolean = false;

  constructor() {
    super();
  }

  splitByDoubleNewline(text: string): string[] {
    return text.split('\n\n');
  }
}
