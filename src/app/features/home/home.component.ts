import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthSelectors } from '../../shared/store/auth';
import { Observable, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';
import { IMG_SIZES } from '../../providers';
import { ImgComponent } from '../../shared/components/img/img.component';
import { PredominantImgColorService } from '../../shared/services/predominant-img-color.service';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { RandomImageStore } from '../../shared/component-store/random-image-store.service';
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
  private readonly TMDB_PROFILE_1920W_1080H_IMG_URL = inject(
    IMG_SIZES.TMDB_PROFILE_1920W_1080H_IMG_URL
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
    console.log('img src: ', imgSrc);
    return `${this.TMDB_PROFILE_1920W_1080H_IMG_URL}${imgSrc}`;
  }
}
