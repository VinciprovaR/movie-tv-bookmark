import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  OptionFilter,
  SelectTransformConfig,
} from '../../interfaces/tmdb-filters.interface';

@Component({
  selector: 'app-select-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-filter.component.html',
  styleUrl: './select-filter.component.css',
})
export class SelectFilterComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  @Input({ required: true })
  controlName!: string;
  @Input({ required: true })
  selectObject!: { [key: string]: any }[] | OptionFilter[];
  @Input()
  defaultOption: OptionFilter | null = null;
  @Input()
  title: string = '';
  @Input()
  selectTransformConfig!: SelectTransformConfig;

  getSelectObject() {
    let selectObject = this.selectObject;
    if (this.selectTransformConfig) {
      selectObject = this.selectObject.map((option: { [key: string]: any }) => {
        return {
          label: option[this.selectTransformConfig.labelKey],
          value: option[this.selectTransformConfig.valueKey],
        };
      });
    }

    return selectObject;
  }

  get selectControl(): FormControl {
    return this.filterForm.controls[this.controlName] as FormControl;
  }
}
