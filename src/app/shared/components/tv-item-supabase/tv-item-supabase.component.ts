import { Component, Input, OnInit } from '@angular/core';
import { MediaType, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data } from '../../interfaces/supabase/entities';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-tv-item-supabase',
  standalone: true,
  imports: [MediaCardComponent],
  templateUrl: './tv-item-supabase.component.html',
  styleUrl: './tv-item-supabase.component.css',
})
export class TVItemSupabaseComponent {
  @Input({ alias: 'mediaData', required: true })
  tvData!: TV_Data;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  constructor() {}
}
