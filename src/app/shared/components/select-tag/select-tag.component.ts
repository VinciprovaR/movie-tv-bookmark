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
import { GenreControl } from '../../interfaces/TMDB/tmdb-filters.interface';

import { ChangeDetectionStrategy } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTagComponent implements ControlValueAccessor {
  @Input({ required: true })
  genre!: GenreControl;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};
  isDisabled = false;

  @Output()
  genreSelected = new EventEmitter<GenreControl>();

  constructor() {}
  writeValue(newValue: any): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  selectGenre() {
    this.genre.isSelected = !this.genre.isSelected;
    this.onChange(this.genre);
    this.genreSelected.emit(this.genre);
  }
}
