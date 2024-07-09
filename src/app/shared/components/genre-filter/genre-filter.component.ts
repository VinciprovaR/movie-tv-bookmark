import { Component, inject, Input, OnInit } from '@angular/core';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Genre,
  GenreControl,
  GenreGroup,
} from '../../interfaces/tmdb-filters.interface';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [SelectTagComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './genre-filter.component.html',
  styleUrl: './genre-filter.component.css',
})
export class GenreFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  protected readonly fb = inject(FormBuilder);
  constructor() {}

  get genresGroup(): FormGroup<GenreGroup> {
    return this.filterForm.controls['genres'] as FormGroup<GenreGroup>;
  }
}
