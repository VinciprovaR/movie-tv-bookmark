import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  DiscoveryFilterForm,
  ReleaseDateGroup,
} from '../../interfaces/tmdb-filters.interface';

@Component({
  selector: 'app-release-date-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './release-date-filter.component.html',
  styleUrl: './release-date-filter.component.css',
})
export class ReleaseDateFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;

  constructor() {}
  get realeaseDateGroup(): FormGroup<ReleaseDateGroup> {
    return this.filterForm.controls[
      'releaseDate'
    ] as FormGroup<ReleaseDateGroup>;
  }
}
