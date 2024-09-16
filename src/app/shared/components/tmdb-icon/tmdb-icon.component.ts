import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { ImgComponent } from '../../components/img/img.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-tmdb-icon',
  standalone: true,
  imports: [ImgComponent],
  templateUrl: './tmdb-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmdbIconComponent extends AbstractComponent implements OnInit {
  @Input({ required: true })
  mediaId: number = 0;
  @Input({ required: true })
  mediaType!: MediaType;

  tmdbBaseUrl: string = 'https://www.themoviedb.org';
  externalUrl: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildExternalLink();
  }

  buildExternalLink() {
    this.externalUrl = this.externalUrl.concat(
      `${this.tmdbBaseUrl}/${this.mediaType}/${this.mediaId}`
    );
  }
}
