import { Directive, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  DateRange,
  VoteAverage,
} from '../../interfaces/store/discovery-state.interface';
import {
  DateRangeGroup,
  Genre,
  Language,
  OptionFilter,
  SelectTransformConfig,
  VoteAverageGroup,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
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

  initIncludeBookmarkControl(
    includeMediaWithBookmarkSelected: boolean
  ): FormControl<boolean> {
    return this.fb.control<boolean>(includeMediaWithBookmarkSelected, {
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

  buildIncludeBookmarkPayload(
    includeBookmarkControl: FormControl<boolean>
  ): boolean {
    return includeBookmarkControl.value ? includeBookmarkControl.value : false;
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
      if (voteAverageGroup.value.voteAverageMin) {
        if (voteAverageGroup.value.voteAverageMin > 0) {
          voteAverageMin = voteAverageGroup.value.voteAverageMin / 10;
        }
      }

      if (voteAverageGroup.value.voteAverageMax) {
        if (voteAverageGroup.value.voteAverageMax > 0) {
          voteAverageMax = voteAverageGroup.value.voteAverageMax / 10;
        }
      }
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
