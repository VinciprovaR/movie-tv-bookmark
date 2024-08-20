import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Keyword } from '../../interfaces/TMDB/tmdb-media.interface';
import { StaticTagComponent } from '../static-tag/static-tag.component';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-media-keywords',
  standalone: true,
  imports: [CommonModule, StaticTagComponent, MissingFieldPlaceholderComponent],
  templateUrl: './media-keywords.component.html',
  styleUrl: './media-keywords.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaKeywordsComponent extends AbstractComponent {
  @Input({ required: true })
  keywords: Keyword[] = [];

  constructor() {
    super();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
