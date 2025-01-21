import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  takeUntil,
} from 'rxjs';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

export interface InputQueryForm {
  inputQuery: FormControl<string>;
}

@Component({
  selector: 'app-input-query',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatInputModule],
  templateUrl: './input-query.component.html',
  styleUrl: './input-query.component.css',
})
export class InputQueryComponent extends AbstractComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Output()
  queryEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  placeholder!: string;
  @Input()
  query: string = '';
  @Input()
  clickSubmit: boolean = false;
  @Input()
  maxLength: number = 80;
  @Input()
  isLoading$!: Observable<boolean>;
  @Input()
  buttonLabel = 'Search';
  submitted = false;
  inputQueryForm!: FormGroup<InputQueryForm>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    if (!this.clickSubmit) {
      this.inputQueryForm.valueChanges
        .pipe(
          takeUntil(this.destroyed$),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((query) => {
          this.onSubmit();
        });
    }
  }

  buildForm(): void {
    this.inputQueryForm = new FormGroup<InputQueryForm>({
      inputQuery: this.fb.control<string>(this.query, {
        validators: [],
        nonNullable: true,
      }),
    });
  }

  onSubmit() {
    this.submitted = true;
    this.queryEmitter.emit(this.inputQueryForm.controls.inputQuery.value);
  }
}
