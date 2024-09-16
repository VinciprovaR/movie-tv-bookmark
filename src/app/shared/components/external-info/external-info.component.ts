import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { ImdbIconComponent } from '../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../tmdb-icon/tmdb-icon.component';

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
