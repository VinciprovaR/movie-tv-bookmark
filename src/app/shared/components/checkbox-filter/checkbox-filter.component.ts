import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-checkbox-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkbox-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFilterComponent
  extends AbstractComponent
  implements OnInit
{
  @Input()
  title: string = '';
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  @Input({ required: true })
  controlName!: string;
  @Input({ required: true })
  label!: string;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  get checkBoxControl(): FormControl {
    return this.filterForm.controls[this.controlName] as FormControl;
  }
}
