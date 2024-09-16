import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent],
  templateUrl: './overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
