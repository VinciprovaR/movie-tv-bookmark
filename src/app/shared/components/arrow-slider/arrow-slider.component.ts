import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { arrowType } from '../../interfaces/layout.interface';

@Component({
  selector: 'app-arrow-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrow-slider.component.html',
  styleUrl: './arrow-slider.component.css',
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
