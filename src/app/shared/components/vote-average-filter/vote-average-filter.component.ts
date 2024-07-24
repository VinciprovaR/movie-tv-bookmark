import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

import { VoteAverageGroup } from '../../interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-vote-average-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './vote-average-filter.component.html',
  styleUrl: './vote-average-filter.component.css',
})
export class VoteAverageFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {}
  get voteAverageGroup(): FormGroup<VoteAverageGroup> {
    return this.filterForm.controls[
      'voteAverage'
    ] as FormGroup<VoteAverageGroup>;
  }
}
