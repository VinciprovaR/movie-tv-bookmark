import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent {
  @Input({ required: true })
  voteAverage: number = 0;

  getVoteIconMetadata(voteAverage: number): { icon: string; color: string } {
    if (voteAverage < 6) {
      return { icon: 'thumb_down_alt', color: 'red' };
    } else {
      return { icon: 'thumb_up_alt', color: 'green' };
    }
  }
}
