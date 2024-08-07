import { Component, Input, OnInit } from '@angular/core';
import { ImgComponent } from '../components/img/img.component';
import { MediaType } from '../interfaces/TMDB/tmdb-media.interface';

@Component({
  selector: 'app-tmdb-icon',
  standalone: true,
  imports: [ImgComponent],
  templateUrl: './tmdb-icon.component.html',
  styleUrl: './tmdb-icon.component.css',
})
export class TmdbIconComponent implements OnInit {
  @Input({ required: true })
  mediaId: number = 0;
  @Input({ required: true })
  mediaType!: MediaType;

  tmdbBaseUrl: string = 'https://www.themoviedb.org';
  externalUrl: string = '';

  constructor() {}

  ngOnInit(): void {
    this.buildExternalLink();
  }

  buildExternalLink() {
    this.externalUrl = this.externalUrl.concat(
      `${this.tmdbBaseUrl}/${this.mediaType}/${this.mediaId}`
    );
  }
}
