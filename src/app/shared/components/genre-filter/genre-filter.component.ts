import { Component, inject, Input } from '@angular/core';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenreGroup } from '../../interfaces/TMDB/tmdb-filters.interface';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [SelectTagComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './genre-filter.component.html',
  styleUrl: './genre-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreFilterComponent extends AbstractComponent {
  protected readonly fb = inject(FormBuilder);

  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  get genresGroup(): FormGroup<GenreGroup> {
    return this.filterForm.controls['genres'] as FormGroup<GenreGroup>;
  }
}
