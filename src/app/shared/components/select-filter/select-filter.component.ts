import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  OptionFilter,
  SelectTransformConfig,
} from '../../interfaces/TMDB/tmdb-filters.interface';

@Component({
  selector: 'app-select-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-filter.component.html',
  styleUrl: './select-filter.component.css',
})
export class SelectFilterComponent implements OnInit {
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
  selectTransform!: {
    objectToTransformSelect: { [key: string]: any }[];
    config: SelectTransformConfig;
  };

  ngOnInit(): void {
    this.transformSelectObject();
  }

  transformSelectObject() {
    if (this.selectTransform) {
      this.selectObject = this.selectObject.map(
        (option: { [key: string]: any }) => {
          return {
            label: option[this.selectTransform.config.labelKey],
            value: option[this.selectTransform.config.valueKey],
          };
        }
      );
    }
  }

  get selectControl(): FormControl {
    return this.filterForm.controls[this.controlName] as FormControl;
  }
}
