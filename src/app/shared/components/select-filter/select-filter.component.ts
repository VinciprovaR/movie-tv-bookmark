import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import {
  OptionFilter,
  SelectTransformConfig,
} from '../../interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-select-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-filter.component.html',
})
export class SelectFilterComponent extends AbstractComponent {
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

  constructor() {
    super();
  }

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
