import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ImgComponent } from '../img/img.component';
import { arrowType } from '../../interfaces/layout.interface';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';


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
