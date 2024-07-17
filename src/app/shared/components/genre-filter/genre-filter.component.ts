import { Component, inject, Input, OnInit } from '@angular/core';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Genre,
  GenreControl,
  GenreGroup,
} from '../../interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [SelectTagComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './genre-filter.component.html',
  styleUrl: './genre-filter.component.css',
})
export class GenreFilterComponent {
  protected readonly fb = inject(FormBuilder);

  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {}

  get genresGroup(): FormGroup<GenreGroup> {
    return this.filterForm.controls['genres'] as FormGroup<GenreGroup>;
  }
}
