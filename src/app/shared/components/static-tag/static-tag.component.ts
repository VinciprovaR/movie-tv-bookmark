import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-static-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './static-tag.component.html',
  styleUrl: './static-tag.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticTagComponent extends AbstractComponent {
  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  @Input({ required: true })
  tag: string = '';
  @Input()
  type: 'square' | 'ellipse' | 'rounded-edge' = 'square';
}
