import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent extends AbstractComponent {
  @Input({ required: true })
  voteAverage: number = 0;

  constructor() {
    super();
  }
}
