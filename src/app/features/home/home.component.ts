import { Component, inject, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../shared/store/auth';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js/';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

import { ChangeDetectionStrategy } from '@angular/core';
import { RandomMediaImageService } from '../../shared/services/random-media-image.service';
import { IMG_SIZES } from '../../providers';
import { ImgComponent } from '../../shared/components/img/img.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImgComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AbstractComponent implements OnInit {
  protected readonly TMDB_HOME_LG_IMG_URL = inject(
    IMG_SIZES.TMDB_HOME_LG_IMG_URL
  );
  protected readonly TMDB_HOME_SM_IMG_URL = inject(
    IMG_SIZES.TMDB_HOME_SM_IMG_URL
  );
  protected readonly TMDB_ORIGINAL_IMG_URL = inject(
    IMG_SIZES.TMDB_ORIGINAL_IMG_URL
  );

  private readonly randomMediaImageService = inject(RandomMediaImageService);
  selectUser$!: Observable<User | null>;
  randomImage$!: Observable<string>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSelectors();
  }

  buildBgStyle(imgSrc: string) {
    const res = `url('${this.getFullImageUrl(imgSrc)}')`;
    console.log(res);

    return res;
  }

  getFullImageUrl(imgSrc: string) {
    return `${this.TMDB_HOME_LG_IMG_URL}${imgSrc}`;
  }

  override initSelectors(): void {
    this.selectUser$ = this.store.select(AuthSelectors.selectUser);
    this.randomImage$ = this.randomMediaImageService.randomImage$;
  }
  override initSubscriptions(): void {}
}
