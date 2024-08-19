import { Component, Input, OnInit } from '@angular/core';
import { MediaType } from '../interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-imdb-icon',
  standalone: true,
  imports: [],
  templateUrl: './imdb-icon.component.html',
  styleUrl: './imdb-icon.component.css',
})
export class ImdbIconComponent implements OnInit {
  @Input({ required: true })
  mediaId: string = '';
  @Input({ required: true })
  mediaType!: MediaType;

  tmdbBaseUrl: string = 'https://www.imdb.com';
  externalUrl: string = '';

  constructor() {}

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
