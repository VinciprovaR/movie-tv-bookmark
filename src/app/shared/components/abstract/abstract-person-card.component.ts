import { Directive, inject } from '@angular/core';
import { IMG_SIZES } from '../../../providers';
import { AbstractComponent } from './abstract-component.component';

@Directive()
export abstract class AbstractPersonCardComponent extends AbstractComponent {
  detailMediaPath: string = '';

  protected readonly TMDB_SEARCH_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_1X_IMG_URL
  );
  protected readonly TMDB_SEARCH_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_SEARCH_LIST_2X_IMG_URL
  );
  protected readonly TMDB_DETAIL_LIST_1X_IMG_URL = inject(
    IMG_SIZES.TMDB_DETAIL_LIST_1X_IMG_URL
  );
  protected readonly TMDB_DETAIL_LIST_2X_IMG_URL = inject(
    IMG_SIZES.TMDB_DETAIL_LIST_2X_IMG_URL
  );

  protected readonly TMDB_W_300_IMG_URL = inject(IMG_SIZES.TMDB_W_300_IMG_URL);
  protected readonly TMDB_W_400_IMG_URL = inject(IMG_SIZES.TMDB_W_400_IMG_URL);
  protected readonly TMDB_W_500_IMG_URL = inject(IMG_SIZES.TMDB_W_500_IMG_URL);
  protected readonly TMDB_CREDITS_IMG_URL = inject(
    IMG_SIZES.TMDB_CREDITS_IMG_URL
  );

  abstract ngOnInit(): void;

  buildDetailPath(id: number) {
    this.detailMediaPath = this.detailMediaPath.concat(`/person-detail/${id}`);
  }
}
