import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

@Component({
  selector: 'app-biography',
  standalone: true,
  imports: [CommonModule, MissingFieldPlaceholderComponent],
  templateUrl: './biography.component.html',
  styleUrl: './biography.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiographyComponent extends AbstractComponent {
  @Input({ required: true })
  biography!: string;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  splitByDoubleNewline(text: string): string[] {
    return text.split('\n\n');
  }
}
