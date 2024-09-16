import { Directive, inject, Input } from '@angular/core';
import { FastAverageColorResult } from 'fast-average-color';
import { Observable } from 'rxjs';
import { PredominantImgColorService } from '../../../services/predominant-img-color.service';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class MediaDetailMainInfoComponent extends AbstractComponent {
  readonly predominantImgColorService = inject(PredominantImgColorService);

  predominantColorResultObs$!: Observable<FastAverageColorResult>;

  @Input({ required: true })
  mediaTitle: string = '';
  @Input({ required: true })
  releaseDate: string = '';

  @Input()
  headerMediaGradient: string = '';
  @Input()
  contentMediaGradient: string = '';
  @Input({ required: true })
  textColorBlend: string = '';
  @Input({ required: true })
  isDark: boolean = false;

  rating: string = '';
  detailMediaPath: string = '';

  constructor() {
    super();
  }

  abstract ngOnInit(): void;
  abstract buildMainCrewMap(): void;
  abstract buildMainCastMap(): void;
  abstract populateRating(): void;

  buildDetailPath(id: number): string {
    return `/person-detail/${id}`;
  }
}
