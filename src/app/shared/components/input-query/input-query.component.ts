import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-query',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatInputModule],
  templateUrl: './input-query.component.html',
  styleUrl: './input-query.component.css',
})
export class InputQueryComponent implements OnInit {
  destroyed$ = new Subject();

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

  constructor(private fb: FormBuilder, private store: Store) {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
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
