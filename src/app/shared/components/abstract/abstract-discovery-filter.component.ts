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

import { Subject, Observable } from 'rxjs';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import {
  DateRange,
  VoteAverage,
} from '../../interfaces/store/discovery-state.interface';
import {
  Language,
  Genre,
  GenreGroup,
  GenreControl,
  DateRangeGroup,
  VoteAverageGroup,
  SelectTransformConfig,
  OptionFilter,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { AbstractFilter } from './abstract-filter.component';

@Directive()
export abstract class AbstractDiscoveryFilter<
  T1,
  T2 extends { [K in keyof T2]: AbstractControl<any, any> }
> extends AbstractFilter<T1, T2> {
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  languageList!: Language[];
  @Input({ required: true })
  combinedDiscoveryFilters$!: Observable<[T1, Genre[]]>;

  languagesTransformConfig: SelectTransformConfig = {
    labelKey: 'english_name',
    valueKey: 'iso_639_1',
  };
  languagesDefaultOption: OptionFilter = {
    label: 'No languages selected',
    value: '',
  };

  constructor() {
    super();
  }

  initDateRangeGroup(
    releaseDateSelected: DateRange | null
  ): FormGroup<DateRangeGroup> {
    const fromSelected = releaseDateSelected?.from
      ? new Date(releaseDateSelected.from)
      : null;

    const toSelected = releaseDateSelected?.to
      ? new Date(releaseDateSelected.to)
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    return this.fb.group<DateRangeGroup>({
      from: this.fb.control<Date | null>(fromSelected),
      to: this.fb.control<Date>(toSelected),
    });
  }

  initIncludeLifecycleControl(
    includeMediaWithLifecycleSelected: boolean
  ): FormControl<boolean> {
    return this.fb.control<boolean>(includeMediaWithLifecycleSelected, {
      nonNullable: true,
    });
  }

  initLanguagesControl(languageSelected: string): FormControl<string> {
    return this.fb.control<string>(languageSelected, {
      nonNullable: true,
    });
  }

  initVoteAverageGroup(
    voteAverageSelected: VoteAverage
  ): FormGroup<VoteAverageGroup> {
    return this.fb.group<VoteAverageGroup>({
      voteAverageMin: this.fb.control<number>(
        voteAverageSelected.voteAverageMin * 10,
        {
          nonNullable: true,
        }
      ),
      voteAverageMax: this.fb.control<number>(
        voteAverageSelected.voteAverageMax * 10,
        {
          nonNullable: true,
        }
      ),
    });
  }

  initMinVoteControl(minVote: number): FormControl<number> {
    return this.fb.control<number>(minVote, {
      nonNullable: true,
    });
  }

  releaseDateValidatorFactory() {
    return (group: AbstractControl) => {
      let releaseGroup = group as FormGroup<DateRangeGroup>;
      let toControl = releaseGroup.controls.to;
      let fromControl = releaseGroup.controls.from;

      if (
        toControl.value &&
        fromControl.value &&
        fromControl.value > toControl.value
      ) {
        fromControl.setErrors({
          invalidFromDate: true,
        });
      } else {
        fromControl.setErrors(null);
      }
      return null;
    };
  }

  buildIncludeLifecyclePayload(
    includeLifecycleControl: FormControl<boolean>
  ): boolean {
    return includeLifecycleControl.value
      ? includeLifecycleControl.value
      : false;
  }

  buildLanguagePayload(lnguageControl: FormControl<string>): string {
    return lnguageControl.value ? lnguageControl.value : '';
  }

  buildVoteAveragePayload(
    voteAverageGroup: FormGroup<VoteAverageGroup>
  ): VoteAverage {
    let voteAverageMin = 0;
    let voteAverageMax = 100;
    if (voteAverageGroup) {
      voteAverageMin =
        voteAverageGroup.value.voteAverageMin ??
        voteAverageGroup.value.voteAverageMin
          ? voteAverageGroup.value.voteAverageMin > 0
            ? voteAverageGroup.value.voteAverageMin / 10
            : 0
          : 0;

      voteAverageMax =
        voteAverageGroup.value.voteAverageMax ??
        voteAverageGroup.value.voteAverageMax
          ? voteAverageGroup.value.voteAverageMax > 0
            ? voteAverageGroup.value.voteAverageMax / 10
            : 0
          : 0;
    }

    return {
      voteAverageMin: voteAverageMin,
      voteAverageMax: voteAverageMax,
    };
  }

  buildMinVotePayload(minVoteControl: FormControl<number>): number {
    return minVoteControl.value;
  }

  buildDateRangePayload(rangeDateGroup: FormGroup<DateRangeGroup>): DateRange {
    return {
      from: this.formatDate(rangeDateGroup.value.from),
      to: this.formatDate(rangeDateGroup.value.to),
    };
  }

  formatDate(date: Date | null | undefined): string {
    if (date) {
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0');
      let day = String(date.getDate()).padStart(2, '0');

      // Format the date as yyyy-mm-dd
      return `${year}-${month}-${day}`;
    }
    return '';
  }
}
