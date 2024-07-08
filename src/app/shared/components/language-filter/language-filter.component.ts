import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Certification,
  DiscoveryFilterForm,
  Language,
} from '../../interfaces/tmdb-filters.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './language-filter.component.html',
  styleUrl: './language-filter.component.css',
})
export class LanguageFilterComponent implements OnInit, AfterViewInit {
  @Input({ required: true })
  filterForm!: FormGroup<DiscoveryFilterForm>;

  @Input({ required: true })
  languagesOptions!: Language[];

  constructor() {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  get languagesControl(): FormControl {
    return this.filterForm.controls['languages'] as FormControl;
  }
}
