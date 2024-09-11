import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ImgComponent } from '../img/img.component';

import { AbstractComponent } from '../abstract/abstract-component.component';

export type arrowType = 'up' | 'right' | 'down' | 'left';

@Component({
  selector: 'app-arrow-slider',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './arrow-slider.component.html',
  styleUrl: './arrow-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowSliderComponent extends AbstractComponent {
  @Output()
  emitClick = new EventEmitter<null>();
  @Input({ required: true })
  arrowType!: arrowType;

  constructor() {
    super();
  }

  onClick() {
    this.emitClick.emit();
  }
}
