import { Component, Input, OnInit } from '@angular/core';
import { ImgComponent } from '../../components/img/img.component';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../../components/abstract/abstract-component.component';

@Component({
  selector: 'app-tmdb-icon',
  standalone: true,
  imports: [ImgComponent],
  templateUrl: './tmdb-icon.component.html',
  styleUrl: './tmdb-icon.component.css',
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
  override initSelectors(): void {}
  override initSubscriptions(): void {}
  buildExternalLink() {
    this.externalUrl = this.externalUrl.concat(
      `${this.tmdbBaseUrl}/${this.mediaType}/${this.mediaId}`
    );
  }
}
