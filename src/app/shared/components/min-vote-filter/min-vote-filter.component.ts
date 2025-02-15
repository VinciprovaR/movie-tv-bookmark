import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-min-vote-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './min-vote-filter.component.html',
  styleUrl: './min-vote-filter.component.css',
})
export class MinVoteFilterComponent extends AbstractComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {
    super();
  }

  get voteAverageControl(): FormControl<number> {
    return this.filterForm.controls['minVote'] as FormControl<number>;
  }
}
