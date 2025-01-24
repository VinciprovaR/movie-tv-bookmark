import { Directive, inject, signal, WritableSignal } from '@angular/core';
import { IMG_SIZES } from '../../../providers';
import { PredominantImgColorService } from '../../../services/predominant-img-color.service';
import { AbstractComponent } from './abstract-component.component';
import { BookmarkOption } from '../../interfaces/supabase/media-bookmark.DTO.interface';
import { PredominantColor } from '../../interfaces/layout.interface';

@Directive()
export abstract class AbstractMediaDetailComponent extends AbstractComponent {
  readonly predominantImgColorService = inject(PredominantImgColorService);
  readonly TMDB_BACKDROP_W_1280_IMG_URL = inject(
    IMG_SIZES.TMDB_BACKDROP_W_1280_IMG_URL
  );
  readonly TMDB_POSTER_W_780_IMG_URL = inject(
    IMG_SIZES.TMDB_POSTER_W_780_IMG_URL
  );
  $headerMediaGradient: WritableSignal<string> = signal('');
  $contentMediaGradient: WritableSignal<string> = signal('');
  $textColorBlend: WritableSignal<string> = signal('');
  $isDark: WritableSignal<boolean> = signal(false);

  $bookmarkLabel: WritableSignal<string> = signal('');
  //bookmarkClass: string = '';

  constructor() {
    super();
  }

  getHeaderMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${0.9}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${0.8}))`;
  }

  getContentMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${1}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${1}))`;
  }

  getDefaultColorGradient() {
    return `linear-gradient(to bottom, rgba(${103},${108},${128}, ${255}), rgba(${103},${108},${128}, ${255}))`;
  }

  getTextColorBlend(isDark: boolean) {
    if (isDark) {
      return 'var(--text-color-light) !important';
    }
    return 'var(--text-color-dark) !important';
  }

  setBookmarkLabel(bookmarkOption: BookmarkOption) {
    this.$bookmarkLabel.set(bookmarkOption.label);
  }

  setDetailTone(predominantColor: PredominantColor) {
    this.$isDark.set(predominantColor.isDark);
    this.$textColorBlend.set(predominantColor.textColorBlend);
    this.$headerMediaGradient.set(predominantColor.headerMediaGradient);
    this.$contentMediaGradient.set(predominantColor.contentMediaGradient);
  }
}
