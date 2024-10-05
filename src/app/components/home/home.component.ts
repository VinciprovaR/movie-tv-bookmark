import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { User } from '@supabase/supabase-js';
import { Observable, takeUntil } from 'rxjs';
import { RandomImageStore } from '../../core/component-store/random-image-store.service';
import { AuthSelectors } from '../../core/store/auth';
import { IMG_SIZES } from '../../providers';
import { PredominantImgColorService } from '../../services/predominant-img-color.service';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { PredominantColor } from '../../shared/interfaces/layout.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImgComponent, MatIcon, MatDivider],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AbstractComponent implements OnInit {
  private readonly predominantImgColorService = inject(
    PredominantImgColorService
  );
  private readonly randomImageStore = inject(RandomImageStore);
  private readonly TMDB_BACKDROP_W_1280_IMG_URL = inject(
    IMG_SIZES.TMDB_BACKDROP_W_1280_IMG_URL
  );
  selectUser$!: Observable<User | null>;
  randomImage$!: Observable<string>;
  headerMediaGradient: string = '';
  textColorBlend: string = '';
  backgroundImageStyle: string = '';
  v!: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
    this.initSubscriptions();
    this.randomImageStore.randomImageInitializer();
  }

  initSelectors(): void {
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
    this.randomImage$ = this.randomImageStore.selectRandomImage$;
  }
  initSubscriptions(): void {
    this.predominantImgColorService.getPredominantColorObs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((predominantColor: PredominantColor) => {
        this.textColorBlend = predominantColor.textColorBlend;
        this.headerMediaGradient = predominantColor.headerMediaGradient;
        this.detectChanges();
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
    this.backgroundImageStyle = `url('${this.getFullImageUrl(imgSrc)}')`;
  }

  getFullImageUrl(imgSrc: string) {
    return `${this.TMDB_BACKDROP_W_1280_IMG_URL}${imgSrc}`;
  }
}
