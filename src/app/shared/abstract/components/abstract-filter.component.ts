import {
  Directive,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { takeUntil } from 'rxjs';
import {
  Genre,
  GenreControl,
  GenreGroup,
  OptionFilter,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractFilter<
    T1,
    T2 extends { [K in keyof T2]: AbstractControl<any, any> }
  >
  extends AbstractComponent
  implements OnInit
{
  protected readonly fb = inject(FormBuilder);

  @Input({ required: true })
  sortBySelect!: OptionFilter[];
  @Output()
  payloadEmitterOnSubmit: EventEmitter<T1> = new EventEmitter<T1>();

  filterForm!: FormGroup<T2>;
  isHideFilterContainer: boolean = true;
  isHideSortContainer: boolean = true;
  isDisableButton: boolean = true;

  constructor() {
    super();
  }

  abstract ngOnInit(): void;
  abstract buildForm(filterSelected: T1, genreList: Genre[]): void;
  abstract onSubmit(): void;
  abstract buildPayload(): T1;

  initGenreGroup(
    genresSelected: number[],
    genreList: Genre[]
  ): FormGroup<GenreGroup> {
    let genreGroup: GenreGroup = {};
    genreList.forEach((genre) => {
      genreGroup[genre.id] = this.fb.control<GenreControl>(
        {
          id: genre.id,
          name: genre.name,
          isSelected: genresSelected.indexOf(genre.id) != -1,
        },
        { nonNullable: true }
      );
    });

    return this.fb.group<GenreGroup>({
      ...genreGroup,
    });
  }

  initSortByControl(sortBySelected: string): FormControl<string> {
    return this.fb.control<string>(sortBySelected, {
      nonNullable: true,
    });
  }

  buildGenresSelectedListPayload(genresGroup: FormGroup<GenreGroup>): number[] {
    let genresSelectedId: number[] = [];
    Object.entries(genresGroup.value).forEach((entries) => {
      let [genreId, genre]: [string, any] = entries;
      if (genre.isSelected) {
        genresSelectedId.push(+genreId);
      }
    });
    return genresSelectedId;
  }

  buildSortByPayload(sortyByControl: FormControl<string>): string {
    return sortyByControl.value ? sortyByControl.value : '';
  }

  toggleMenuFilter() {
    this.isHideFilterContainer = !this.isHideFilterContainer;
  }

  toggleMenuSort() {
    this.isHideSortContainer = !this.isHideSortContainer;
  }

  registerBehaviourValueChange() {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((formValueChange) => {
        this.toggleButtonSearch(false);
      });
  }

  toggleButtonSearch(isDisableButton: boolean) {
    this.isDisableButton = isDisableButton;
  }
}
