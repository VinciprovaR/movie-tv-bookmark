import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { VoteAverageGroup } from '../../interfaces/TMDB/tmdb-filters.interface';

import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-vote-average-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './vote-average-filter.component.html',
  styleUrl: './vote-average-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteAverageFilterComponent extends AbstractComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {
    super();
  }

  get voteAverageGroup(): FormGroup<VoteAverageGroup> {
    return this.filterForm.controls[
      'voteAverage'
    ] as FormGroup<VoteAverageGroup>;
  }
}
