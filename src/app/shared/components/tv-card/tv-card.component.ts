import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LifecycleSelectorComponent } from '../lifecycle-selector/lifecycle-selector.component';
import { TV_Data } from '../../interfaces/supabase/entities';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractMediaCard } from '../abstract/abstract-media-card.component';

@Component({
  selector: 'app-tv-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    LifecycleSelectorComponent,
    RouterModule,
    PercentPipe,
    MatIconModule,
  ],
  templateUrl: './tv-card.component.html',
  styleUrl: './tv-card.component.css',
})
export class TVCardComponent extends AbstractMediaCard implements OnInit {
  @Input({ alias: 'media', required: true })
  tv!: TV | TV_Data;
  @Input({ required: true })
  index: number = 0;

  voteIcon: string = '';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.buildDetailPath(this.tv.id);
    this.buildCard1or2xImgUrl(this.tv.poster_path);
  }

  get voteAverage(): number | null {
    if (this.isTVEntity(this.tv)) {
      return this.tv.vote_average;
    }
    return null;
  }

  isTVEntity(tv: object): tv is TV {
    return (tv as TV).vote_average !== undefined;
  }
}
