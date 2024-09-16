import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GenreGroup } from '../../interfaces/TMDB/tmdb-filters.interface';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

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
