import { Component, Input } from '@angular/core';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DiscoveryFilterForm } from '../../interfaces/tmdb-filters.interface';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [SelectTagComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './genre-filter.component.html',
  styleUrl: './genre-filter.component.css',
})
export class GenreFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;

  constructor() {}
  get genresGroup(): FormGroup {
    return this.filterForm.controls['genres'] as FormGroup;
  }
}
