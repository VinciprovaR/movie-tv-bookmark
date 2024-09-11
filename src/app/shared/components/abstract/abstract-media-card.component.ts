import {
  Directive,
  inject,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { LIFECYCLE_STATUS_MAP } from '../../../providers';
import { BridgeDataService } from '../../services/bridge-data.service';
import { bookmarkEnum } from '../../interfaces/supabase/supabase-bookmark.interface';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractMediaCard extends AbstractComponent {
  protected readonly bridgeDataService = inject(BridgeDataService);

  protected readonly bookmarkStatusMap = inject(LIFECYCLE_STATUS_MAP);

  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  personId: string = '';

  detailMediaPath: string = '';

  bookmarkEnumSelected: bookmarkEnum = 'noBookmark';

  constructor() {
    super();
  }

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${id}`
    );
  }

  setBookmarkStatusElement(bookmarkEnumSelected: bookmarkEnum) {
    this.bookmarkEnumSelected = bookmarkEnumSelected;
  }
}
