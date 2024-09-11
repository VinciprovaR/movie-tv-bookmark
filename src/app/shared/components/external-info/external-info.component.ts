import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ImdbIconComponent } from '../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../tmdb-icon/tmdb-icon.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-external-info',
  standalone: true,
  imports: [ImdbIconComponent, TmdbIconComponent],
  templateUrl: './external-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalInfoComponent extends AbstractComponent {
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  tmdbId!: number;
  @Input()
  imdbId!: string;
}
