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

  getVoteIconMetadata(voteAverage: number): { icon: string; color: string } {
    if (voteAverage < 6) {
      return { icon: 'thumb_down_alt', color: 'red' };
    } else {
      return { icon: 'thumb_up_alt', color: 'green' };
    }
  }
}
