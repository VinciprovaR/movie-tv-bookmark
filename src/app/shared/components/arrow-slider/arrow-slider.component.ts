import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImgComponent } from '../img/img.component';
import { ChangeDetectionStrategy } from '@angular/core';
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
export class ArrowSliderComponent extends AbstractComponent implements OnInit {
  @Output()
  emitClick = new EventEmitter<null>();
  @Input({ required: true })
  arrowType!: arrowType;

  constructor() {
    super();
  }

  ngOnInit(): void {}
  override initSelectors(): void {}
  override initSubscriptions(): void {}
  onClick() {
    this.emitClick.emit();
  }
}
