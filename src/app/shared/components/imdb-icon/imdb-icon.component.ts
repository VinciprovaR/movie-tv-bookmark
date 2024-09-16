import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-imdb-icon',
  standalone: true,
  imports: [],
  templateUrl: './imdb-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImdbIconComponent extends AbstractComponent implements OnInit {
  @Input({ required: true })
  mediaId: string = '';
  @Input({ required: true })
  mediaType!: MediaType;

  tmdbBaseUrl: string = 'https://www.imdb.com';
  externalUrl: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.buildExternalLink();
  }

  buildExternalLink() {
    this.externalUrl = this.externalUrl.concat(
      `${this.tmdbBaseUrl}${this.mediaType === 'person' ? '/name' : '/title'}/${
        this.mediaId
      }`
    );
  }
}
