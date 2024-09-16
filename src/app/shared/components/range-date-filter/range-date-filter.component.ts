import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { DateRangeGroup } from '../../interfaces/TMDB/tmdb-filters.interface';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeDateFilterComponent extends AbstractComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  @Input({ required: true })
  customGroupName!: string;
  @Input({ required: true })
  rangeDateLabel!: string;

  minDate: Date;
  maxDate: Date;

  constructor() {
    super();
    this.minDate = new Date(1900, 0, 1);
    this.maxDate = new Date(2099, 11, 31); 
  }

  get dateRangeGroup(): FormGroup<DateRangeGroup> {
    return this.filterForm.controls[
      this.customGroupName
    ] as FormGroup<DateRangeGroup>;
  }
}
