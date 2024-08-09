import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Keyword } from '../../interfaces/TMDB/tmdb-media.interface';
import { StaticTagComponent } from '../static-tag/static-tag.component';

@Component({
  selector: 'app-media-keywords',
  standalone: true,
  imports: [CommonModule, StaticTagComponent],
  templateUrl: './media-keywords.component.html',
  styleUrl: './media-keywords.component.css',
})
export class MediaKeywordsComponent {
  @Input({ required: true })
  keywords: Keyword[] = [];

  constructor() {}
}
