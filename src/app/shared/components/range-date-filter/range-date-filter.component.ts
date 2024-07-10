import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  DateRangeGroup,
  DiscoveryMovieFilterForm,
} from '../../interfaces/tmdb-filters.interface';

@Component({
  selector: 'app-range-date-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './range-date-filter.component.html',
  styleUrl: './range-date-filter.component.css',
})
export class RangeDateFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;

  @Input({ required: true })
  customGroupName!: string;

  @Input({ required: true })
  rangeDateLabel!: string;

  constructor() {}
  get dateRangeGroup(): FormGroup<DateRangeGroup> {
    return this.filterForm.controls[
      this.customGroupName
    ] as FormGroup<DateRangeGroup>;
  }
}
