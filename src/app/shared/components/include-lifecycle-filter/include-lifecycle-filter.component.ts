import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DiscoveryFilterForm } from '../../interfaces/tmdb-filters.interface';
import { CommonModule } from '@angular/common';
import { MediaType } from '../../interfaces/media.interface';

@Component({
  selector: 'app-include-lifecycle-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './include-lifecycle-filter.component.html',
  styleUrl: './include-lifecycle-filter.component.css',
})
export class IncludeLifecycleFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;

  @Input({ required: true })
  mediaType!: MediaType;

  get includeLifecycleControl(): FormControl {
    return this.filterForm.controls['includeLifecycle'] as FormControl;
  }
}
