import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Certification,
  DiscoveryFilterForm,
} from '../../interfaces/tmdb-filters.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certification-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './certification-filter.component.html',
  styleUrl: './certification-filter.component.css',
})
export class CertificationFilterComponent implements OnInit, AfterViewInit {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;

  @Input({ required: true })
  certificationOptions!: Certification[];

  constructor() {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  get certificationsControl(): FormControl {
    return this.filterForm.controls['certifications'] as FormControl;
  }
}
