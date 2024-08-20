import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  OptionFilter,
  SelectTransformConfig,
} from '../../interfaces/TMDB/tmdb-filters.interface';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-select-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-filter.component.html',
  styleUrl: './select-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  @Input({ required: true })
  controlName!: string;
  @Input()
  selectObject: OptionFilter[] = [];
  @Input()
  defaultOption: OptionFilter | null = null;
  @Input()
  title: string = '';

  @Input()
  set transformSelectObject(selectTransform: {
    objectToTransformSelect: { [key: string]: any }[];
    config: SelectTransformConfig;
  }) {
    this.selectObject = selectTransform.objectToTransformSelect.map(
      (option: { [key: string]: any }) => {
        return {
          label: option[selectTransform.config.labelKey],
          value: option[selectTransform.config.valueKey],
        };
      }
    );
  }

  get selectControl(): FormControl {
    return this.filterForm.controls[this.controlName] as FormControl;
  }
}
