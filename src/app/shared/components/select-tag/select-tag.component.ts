import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-select-tag',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectTagComponent),
      multi: true,
    },
  ],
  templateUrl: './select-tag.component.html',
  styleUrl: './select-tag.component.css',
})
export class SelectTagComponent implements ControlValueAccessor {
  @Input({ required: true })
  genre!: any;

  onChange: (value: string[]) => void = () => {};
  onTouched: Function = () => {};
  isDisabled = false;

  @Output()
  emitany: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  selectGenre() {
    this.genre.isSelected = !this.genre.isSelected;
    this.emitany.emit(this.genre);
  }
}
