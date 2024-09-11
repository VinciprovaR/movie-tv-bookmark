import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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

  @Input({ required: true })
  tag: string = '';
  @Input()
  type: 'square' | 'ellipse' | 'rounded-edge' = 'square';
}
