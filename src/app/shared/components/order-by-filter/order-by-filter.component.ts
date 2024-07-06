import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  DiscoveryFilterForm,
  SortBySelect,
} from '../../interfaces/tmdb-filters.interface';

@Component({
  selector: 'app-order-by-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-by-filter.component.html',
  styleUrl: './order-by-filter.component.css',
})
export class OrderByFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;
  sortBySelect: SortBySelect = {
    'popularity.desc': 'Popularity Descending',
    'popularity.asc': 'Popularity Ascending',
    'vote_average.desc': 'Rating Descending',
    'vote_average.asc': 'Rating Ascending',
    'primary_release_date.desc': 'Release Date Descending',
    'primary_release_date.asc': 'Release Date Ascending',
    'title.asc': 'Title (A-Z)',
    'title.desc': 'Title (Z-A)',
  };

  constructor() {}

  get orderByControl(): FormControl {
    return this.filterForm.controls['sortBy'] as FormControl;
  }
}
