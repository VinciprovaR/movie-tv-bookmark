import { Component, Input } from '@angular/core';
import { MediaType, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-tv-item-tmdb',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './tv-item-tmdb.component.html',
  styleUrl: './tv-item-tmdb.component.css',
})
export class TVItemTmdbComponent {
  @Input({ alias: 'mediaData', required: true })
  tvData!: TV;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  constructor() {}
}
