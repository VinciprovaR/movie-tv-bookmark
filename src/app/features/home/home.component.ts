import { Component, inject, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../shared/store/auth';
import { Observable, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';
import { RandomMediaImageService } from '../../shared/services/random-media-image.service';
import { IMG_SIZES } from '../../providers';
import { ImgComponent } from '../../shared/components/img/img.component';
import { PredominantImgColorService } from '../../shared/services/predominant-img-color.service';
import { FastAverageColorResult } from 'fast-average-color';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImgComponent, MatIcon, MatDivider],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AbstractComponent implements OnInit {
  readonly predominantImgColorService = inject(PredominantImgColorService);

  protected readonly TMDB_ORIGINAL_IMG_URL = inject(
    IMG_SIZES.TMDB_ORIGINAL_IMG_URL
  );
  protected readonly TMDB_PROFILE_1920W_1080H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_1920W_1080H_IMG_URL
  );

  private readonly randomMediaImageService = inject(RandomMediaImageService);
  selectUser$!: Observable<User | null>;
  randomImage$!: Observable<string>;

  headerMediaGradient: string = '';
  textColorBlend: string = '';
  backgroundImageStyle: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
  }

  override initSelectors(): void {
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
    this.randomImage$ = this.randomMediaImageService.randomImage$;
  }
  override initSubscriptions(): void {
    this.randomImage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((imgSrc: string) => {
        this.buildBgStyle(imgSrc);
        this.evaluatePredominantColor(imgSrc);
      });
  }

  buildBgStyle(imgSrc: string) {
    this.backgroundImageStyle = `url('${this.getFullImageUrl(imgSrc)}')`;
  }

  getFullImageUrl(imgSrc: string) {
    return `${this.TMDB_PROFILE_1920W_1080H_IMG_URL}${imgSrc}`;
    // return 'https://image.tmdb.org/t/p/w1920_and_h600_multi_faces_filter(duotone,00192f,00baff)/tfw5LKySp7uEYJ3CUuD4TKx3s8y.jpg';
  }

  evaluatePredominantColor(backdropPath: string) {
    if (backdropPath) {
      this.predominantImgColorService
        .evaluatePredominantColor(backdropPath)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (colorResult: FastAverageColorResult) => {
            this.headerMediaGradient = this.getHeaderMediaGradient(
              colorResult.value
            );

            this.textColorBlend = this.getTextColorBlend(colorResult.isDark);
            this.detectChanges();
          },
          error: (err) => {
            this.headerMediaGradient = this.getDefaultColorGradient();

            this.textColorBlend = this.getTextColorBlend(false);
            this.detectChanges();
          },
        });
    } else {
      this.headerMediaGradient = this.getDefaultColorGradient();

      this.textColorBlend = this.getTextColorBlend(false);
      this.detectChanges();
    }
  }

  getDefaultColorGradient() {
    return `linear-gradient(to bottom, rgba(${103},${108},${128}, ${255}), rgba(${103},${108},${128}, ${255}))`;
  }

  getHeaderMediaGradient(rgbaValue: number[]) {
    return `linear-gradient(to bottom, rgba(${rgbaValue[0]},${rgbaValue[1]},${
      rgbaValue[2]
    }, ${0.8}), rgba(${rgbaValue[0]},${rgbaValue[1]},${rgbaValue[2]}, ${0.7}))`;
  }

  getTextColorBlend(isDark: boolean) {
    if (isDark) {
      return 'var(--text-color-light) !important';
    }
    return 'var(--text-color-dark) !important';
  }
}
