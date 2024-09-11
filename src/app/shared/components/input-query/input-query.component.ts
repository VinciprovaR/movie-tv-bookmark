import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-input-query',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatInputModule],
  templateUrl: './input-query.component.html',
  styleUrl: './input-query.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQueryComponent extends AbstractComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  searchControl: FormControl<string> = this.fb.control<string>('', {
    validators: [],
    nonNullable: true,
  });

  @Output()
  queryEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  placeholder!: string;

  @Input()
  set query(query: string | null) {
    this.searchControl.setValue(query ? query : '', { emitEvent: false });
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        this.queryEmitter.emit(query);
      });
  }
}
