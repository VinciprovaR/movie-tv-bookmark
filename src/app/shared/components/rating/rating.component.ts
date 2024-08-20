import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent extends AbstractComponent {
  @Input({ required: true })
  voteAverage: number = 0;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  getVoteIconMetadata(voteAverage: number): { icon: string; color: string } {
    if (voteAverage < 6) {
      return { icon: 'thumb_down_alt', color: 'red' };
    } else {
      return { icon: 'thumb_up_alt', color: 'green' };
    }
  }
}
