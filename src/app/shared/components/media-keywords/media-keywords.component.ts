import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Keyword } from '../../interfaces/TMDB/tmdb-media.interface';
import { StaticTagComponent } from '../static-tag/static-tag.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-media-keywords',
  standalone: true,
  imports: [CommonModule, StaticTagComponent, MissingFieldPlaceholderComponent],
  templateUrl: './media-keywords.component.html',
  styleUrl: './media-keywords.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaKeywordsComponent {
  @Input({ required: true })
  keywords: Keyword[] = [];

  constructor() {}
}
