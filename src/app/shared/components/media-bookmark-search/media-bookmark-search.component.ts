import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BridgeDataService } from '../../../core/services/bridge-data.service';
import { LIFECYCLE_NAV_ELEMENTS } from '../../../providers';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';
import { BookmarkNavigatorComponent } from '../bookmark-navigator/bookmark-navigator.component';

@Component({
  selector: 'app-media-bookmark-search',
  standalone: true,
  imports: [RouterModule, CommonModule, BookmarkNavigatorComponent],
  providers: [BridgeDataService],
  templateUrl: './media-bookmark-search.component.html',
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
