import {
  Component,
  inject,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenreGroup } from '../../interfaces/TMDB/tmdb-filters.interface';

import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [SelectTagComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './genre-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreFilterComponent extends AbstractComponent {
  protected readonly fb = inject(FormBuilder);

  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {
    super();
  }

  get genresGroup(): FormGroup<GenreGroup> {
    return this.filterForm.controls['genres'] as FormGroup<GenreGroup>;
  }
}
