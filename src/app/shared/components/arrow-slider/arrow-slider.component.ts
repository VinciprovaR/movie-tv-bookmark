import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ImgComponent } from '../img/img.component';

export type arrowType = 'up' | 'right' | 'down' | 'left';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-arrow-slider',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './arrow-slider.component.html',
  styleUrl: './arrow-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowSliderComponent implements OnInit {
  private readonly destroyRef$ = inject(DestroyRef);

  @Output()
  emitClick = new EventEmitter<null>();
  @Input({ required: true })
  arrowType!: arrowType;

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.emitClick.emit();
  }
}
