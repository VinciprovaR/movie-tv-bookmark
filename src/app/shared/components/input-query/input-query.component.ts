import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

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
  set query(query: string) {
    this.searchControl.setValue(query, { emitEvent: false });
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
