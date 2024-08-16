import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
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

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
