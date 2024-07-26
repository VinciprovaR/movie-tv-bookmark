import {
  Directive,
  OnInit,
  inject,
  Input,
  Output,
  EventEmitter,
  DestroyRef,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { Subject, Observable, takeUntil } from 'rxjs';
import {
  Genre,
  GenreGroup,
  GenreControl,
  OptionFilter,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { Store } from '@ngrx/store';

@Directive()
export abstract class AbstractFilter<
  T1,
  T2 extends { [K in keyof T2]: AbstractControl<any, any> }
> implements OnInit
{
  protected readonly store = inject(Store);
  protected readonly fb = inject(FormBuilder);
  protected renderer!: Renderer2;
  protected readonly rendererFactory = inject(RendererFactory2);

  destroyed$ = new Subject();

  @Output()
  payloadEmitterOnSubmit: EventEmitter<T1> = new EventEmitter<T1>();

  filterForm!: FormGroup<T2>;

  @Input({ required: true })
  sortBySelect!: OptionFilter[];

  isHideFilterContainer: boolean = true;
  isHideSortContainer: boolean = true;
  isDisableButton: boolean = true;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  abstract ngOnInit(): void;
  abstract initSubscription(): void;

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

  toggleMenuFilter(container: HTMLElement) {
    if (this.isHideFilterContainer) {
      this.renderer.removeClass(container, 'hidden-container');
    } else {
      this.renderer.addClass(container, 'hidden-container');
    }
    this.isHideFilterContainer = !this.isHideFilterContainer;
  }

  toggleMenuSort(container: HTMLElement) {
    if (this.isHideSortContainer) {
      this.renderer.removeClass(container, 'hidden-container');
    } else {
      this.renderer.addClass(container, 'hidden-container');
    }
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
