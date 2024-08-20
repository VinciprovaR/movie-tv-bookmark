import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-min-vote-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSliderModule],
  templateUrl: './min-vote-filter.component.html',
  styleUrl: './min-vote-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinVoteFilterComponent extends AbstractComponent {
  @Input({ required: true })
  filterForm!: FormGroup<any>;

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}

  get voteAverageControl(): FormControl<number> {
    return this.filterForm.controls['minVote'] as FormControl<number>;
  }
}
