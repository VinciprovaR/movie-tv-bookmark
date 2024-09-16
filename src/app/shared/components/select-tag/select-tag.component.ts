import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

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
export class SelectTagComponent
  extends AbstractComponent
  implements ControlValueAccessor
{
  @Input({ required: true })
  genre!: GenreControl;

  obj: any;

  onChange: (value: any) => void = () => {};
  onTouched: Function = () => {};
  isDisabled = false;

  @Output()
  genreSelected = new EventEmitter<GenreControl>();

  constructor() {
    super();
  }
  writeValue(obj: any): void {
    this.obj = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  selectGenre() {
    this.genre.isSelected = !this.genre.isSelected;
    this.onChange(this.genre);
    this.genreSelected.emit(this.genre);
  }
}
