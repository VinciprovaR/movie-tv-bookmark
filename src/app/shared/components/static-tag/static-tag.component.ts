import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

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

  @Input({ required: true })
  tag: string = '';
  @Input()
  type: 'square' | 'ellipse' | 'rounded-edge' = 'square';
}
