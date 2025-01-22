import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { User } from '@supabase/supabase-js';
import { Observable, takeUntil } from 'rxjs';
import { TrendingMediaStore } from '../../core/component-store/trending-media-store.service';
import { AuthSelectors } from '../../core/store/auth';
import { IMG_SIZES } from '../../providers';
import { PredominantImgColorService } from '../../services/predominant-img-color.service';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { PredominantColor } from '../../shared/interfaces/layout.interface';
import { MediaListContainerComponent } from '../../shared/components/media-list-container/media-list-container.component';
import { Movie, TV } from '../../shared/interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImgComponent, MatIcon, MediaListContainerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends AbstractComponent implements OnInit {
  private readonly predominantImgColorService = inject(
    PredominantImgColorService
  );
  private readonly trendingMediaStore = inject(TrendingMediaStore);

  private readonly TMDB_BACKDROP_ORIGINAL_IMG_URL = inject(
    IMG_SIZES.TMDB_BACKDROP_ORIGINAL_IMG_URL
  );

  trendingMediaLoading$!: Observable<boolean>;
  trendingMediaMovieList$!: Observable<Movie[]>;
  trendingMediaTVList$!: Observable<TV[]>;
  selectUser$!: Observable<User | null>;
  randomImage$!: Observable<string>;
  $headerMediaGradient = signal('');
  $textColorBlend = signal('');
  $backgroundImageStyle = signal('');
  v!: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
    this.trendingMediaStore.tredingMediaInitializer(Date.now());
  }

  initSelectors(): void {
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
    this.randomImage$ = this.trendingMediaStore.selectRandomImage$;
    this.trendingMediaLoading$ = this.trendingMediaStore.selectIsLoading$;
    this.trendingMediaMovieList$ = this.trendingMediaStore.selectMovie$;
    this.trendingMediaTVList$ = this.trendingMediaStore.selectTV$;
  }

  initSubscriptions(): void {
    this.predominantImgColorService.getPredominantColorObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((predominantColor: PredominantColor) => {
        this.$textColorBlend.set(predominantColor.textColorBlend);
        this.$headerMediaGradient.set(predominantColor.headerMediaGradient);
      });

    this.randomImage$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((imgSrc: string) => {
        if (imgSrc) {
          this.buildBgStyle(imgSrc);
          this.predominantImgColorService.evaluatePredominantColor(imgSrc);
        }
      });
  }

  buildBgStyle(imgSrc: string) {
    this.$backgroundImageStyle.set(`url('${this.getFullImageUrl(imgSrc)}')`);
  }

  getFullImageUrl(imgSrc: string) {
    return `${this.TMDB_BACKDROP_ORIGINAL_IMG_URL}${imgSrc}`;
  }
}
