import { Component, Input, OnInit } from '@angular/core';
import { MediaType, TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data } from '../../interfaces/supabase/entities';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-tv-item',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './tv-item.component.html',
  styleUrl: './tv-item.component.css',
})
export class TVItemComponent implements OnInit {
  @Input({ required: true })
  tvData!: TV | TV_Data;
  @Input({ required: true })
  mediaType!: MediaType;
  @Input({ required: true })
  index: number = 0;

  detailMediaPath: string = '';

  constructor() {}
  ngOnInit(): void {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/tv-detail/${this.tvData.id}`
    );
  }
}
