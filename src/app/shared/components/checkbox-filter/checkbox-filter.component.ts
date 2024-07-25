import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkbox-filter.component.html',
  styleUrl: './checkbox-filter.component.css',
})
export class CheckboxFilterComponent implements OnInit {
  @Input()
  title: string = '';
  @Input({ required: true })
  filterForm!: FormGroup<any>;
  @Input({ required: true })
  controlName!: string;
  @Input({ required: true })
  label!: string;

  ngOnInit(): void {}

  get checkBoxControl(): FormControl {
    return this.filterForm.controls[this.controlName] as FormControl;
  }
}
