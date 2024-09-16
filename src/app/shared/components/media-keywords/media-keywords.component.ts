import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { Keyword } from '../../interfaces/TMDB/tmdb-media.interface';
import { MissingFieldPlaceholderComponent } from '../missing-field-placeholder/missing-field-placeholder.component';
import { StaticTagComponent } from '../static-tag/static-tag.component';

@Component({
  selector: 'app-media-keywords',
  standalone: true,
  imports: [CommonModule, StaticTagComponent, MissingFieldPlaceholderComponent],
  templateUrl: './media-keywords.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaKeywordsComponent extends AbstractComponent {
  @Input({ required: true })
  keywords: Keyword[] = [];

  constructor() {
    super();
  }
}
