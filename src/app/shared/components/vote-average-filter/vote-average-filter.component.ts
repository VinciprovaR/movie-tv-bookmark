import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

import {
  DiscoveryFilterForm,
  VoteAverageGroup,
} from '../../interfaces/tmdb-filters.interface';
import { VoteAverage } from '../../interfaces/store/discovery-movie-state.interface';

@Component({
  selector: 'app-vote-average-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './vote-average-filter.component.html',
  styleUrl: './vote-average-filter.component.css',
})
export class VoteAverageFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;

  constructor() {}
  get voteAverageGroup(): FormGroup<VoteAverageGroup> {
    // console.log(this.filterForm.controls['voteAverage']);
    return this.filterForm.controls[
      'voteAverage'
    ] as FormGroup<VoteAverageGroup>;
  }
}
