import { Component, Input } from '@angular/core';
import { GenreTagComponent } from '../genre-tag/genre-tag.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [GenreTagComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './genre-filter.component.html',
  styleUrl: './genre-filter.component.css',
})
export class GenreFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup;

  constructor() {}
  get genresGroup(): FormGroup {
    return this.filterForm.controls['genres'] as FormGroup;
  }
}
