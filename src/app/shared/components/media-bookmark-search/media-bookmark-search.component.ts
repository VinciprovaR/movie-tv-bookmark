import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  RouterModule,
  RouterLinkActive,
  ActivatedRoute,
} from '@angular/router';
import { BridgeDataService } from '../../services/bridge-data.service';
import { NavigatorComponent } from '../bookmark-navigator/bookmark-navigator.component';
import {
  BookmarkNavElement,
  LinkPath,
} from '../../interfaces/navigator.interface';
import { LIFECYCLE_NAV_ELEMENTS } from '../../../providers';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-media-bookmark-search',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive, NavigatorComponent],
  providers: [BridgeDataService],
  templateUrl: './media-bookmark-search.component.html',
  styleUrl: './media-bookmark-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaBookmarkSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly bookmarkNavElements: BookmarkNavElement[] = inject(
    LIFECYCLE_NAV_ELEMENTS
  );
  title: string = '';

  constructor() {}

  ngOnInit(): void {
    this.title = this.route.snapshot.routeConfig?.title
      ? this.route.snapshot.routeConfig.title.toString()
      : '';
  }
}
