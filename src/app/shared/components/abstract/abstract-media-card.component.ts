import { Directive, inject, Input } from '@angular/core';

import { MediaType } from '../../interfaces/TMDB/tmdb-media.interface';
import { IMG_SIZES, LIFECYCLE_STATUS_MAP } from '../../../providers';
import { BridgeDataService } from '../../services/bridge-data.service';
import { lifecycleEnum } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractMediaCard extends AbstractComponent {
  protected readonly bridgeDataService = inject(BridgeDataService);
  protected readonly TMDB_SEARCH_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_1X_IMG_URL
  );
  protected readonly TMDB_SEARCH_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_2X_IMG_URL
  );
  protected readonly lifecycleStatusMap = inject(LIFECYCLE_STATUS_MAP);

  @Input({ required: true })
  mediaType!: MediaType;
  @Input()
  personId: string = '';

  detailMediaPath: string = '';

  lifecycleEnumSelected: lifecycleEnum = 'noLifecycle';

  constructor() {
    super();
  }

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(
      `/${this.mediaType}-detail/${id}`
    );
  }

  setLifecycleStatusElement(lifecycleEnumSelected: lifecycleEnum) {
    this.lifecycleEnumSelected = lifecycleEnumSelected;
  }
}
