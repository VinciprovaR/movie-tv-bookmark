import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MediaType } from '../../interfaces/media.interface';

@Component({
  selector: 'app-checkbox-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkbox-filter.component.html',
  styleUrl: './checkbox-filter.component.css',
})
export class CheckboxFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  formControlName!: string;
  @Input({ required: true })
  label!: string;

  get checkBoxControl(): FormControl {
    return this.filterForm.controls[this.formControlName] as FormControl;
  }
}
