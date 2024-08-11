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

@Component({
  selector: 'app-arrow-slider',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './arrow-slider.component.html',
  styleUrl: './arrow-slider.component.css',
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
