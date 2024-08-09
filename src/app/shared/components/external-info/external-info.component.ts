import { Component, Input } from '@angular/core';
import { ImdbIconComponent } from '../../imdb-icon/imdb-icon.component';
import { TmdbIconComponent } from '../../tmdb-icon/tmdb-icon.component';
import {
  MovieDetail,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-external-info',
  standalone: true,
  imports: [ImdbIconComponent, TmdbIconComponent],
  templateUrl: './external-info.component.html',
  styleUrl: './external-info.component.css',
})
export class ExternalInfoComponent {
  @Input({ required: true })
  mediaData!: MovieDetail | TVDetail;
}
