import { Component, Input } from '@angular/core';
import { ImdbIconComponent } from '../../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../../tmdb-icon/tmdb-icon.component';
import {
  MediaType,
  MovieDetail,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-external-info',
  standalone: true,
  imports: [ImdbIconComponent, TmdbIconComponent],
  templateUrl: './external-info.component.html',
  styleUrl: './external-info.component.css',
})
export class ExternalInfoComponent extends AbstractComponent {
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  tmdbId!: number;
  @Input()
  imdbId!: string;

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
