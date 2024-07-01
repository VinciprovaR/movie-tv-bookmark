import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SORT_ENUM } from '../../../providers';
import { SortEnum } from '../../models/tmdb-filters.models';

@Component({
  selector: 'app-order-by-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-by-filter.component.html',
  styleUrl: './order-by-filter.component.css',
})
export class OrderByFilterComponent {
  sortEnum!: SortEnum;
  constructor(@Inject(SORT_ENUM) private SORT_ENUM: any) {
    this.sortEnum = this.SORT_ENUM;
  }
  @Input({ required: true })
  filterForm!: FormGroup;
}
