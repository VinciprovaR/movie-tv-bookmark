import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { BridgeDataService } from '../../services/bridge-data.service';
import { NavigatorComponent } from '../bookmark-navigator/bookmark-navigator.component';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';
import { LIFECYCLE_NAV_ELEMENTS } from '../../../providers';

import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-media-bookmark-search',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive, NavigatorComponent],
  providers: [BridgeDataService],
  templateUrl: './media-bookmark-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaBookmarkSearchComponent
  extends AbstractComponent
  implements OnInit
{
  readonly bookmarkNavElements: BookmarkNavElement[] = inject(
    LIFECYCLE_NAV_ELEMENTS
  );
  title: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.routeConfig?.title
      ? this.route.snapshot.routeConfig.title.toString()
      : '';
  }
}
