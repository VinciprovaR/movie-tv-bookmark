import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-missing-field-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './missing-field-placeholder.component.html',
  styleUrl: './missing-field-placeholder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissingFieldPlaceholderComponent extends AbstractComponent {
  @Input({ required: true })
  caption: string = '';

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
