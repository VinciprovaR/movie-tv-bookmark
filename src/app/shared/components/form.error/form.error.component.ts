import { Component, Input, OnInit } from '@angular/core';
import { ErrorResponse } from '../../models/auth.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form.error.component.html',
  styleUrl: './form.error.component.css',
})
export class FormErrorComponent implements OnInit {
  @Input({ required: true }) errors!: ErrorResponse | null;

  constructor() {}

  ngOnInit(): void {}
}
