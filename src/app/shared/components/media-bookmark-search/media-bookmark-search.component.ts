import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { LIFECYCLE_NAV_ELEMENTS } from '../../../providers';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';
import { NavigatorComponent } from '../bookmark-navigator/bookmark-navigator.component';
import { BridgeDataService } from '../../../core/services/bridge-data.service';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

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
