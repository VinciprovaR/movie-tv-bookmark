import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { BridgeDataService } from '../../services/bridge-data.service';
import { NavigatorComponent } from '../bookmark-navigator/bookmark-navigator.component';
import { BookmarkNavElement } from '../../interfaces/navigator.interface';
import { LIFECYCLE_NAV_ELEMENTS } from '../../../providers';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract-component.component';

@Component({
  selector: 'app-media-bookmark-search',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive, NavigatorComponent],
  providers: [BridgeDataService],
  templateUrl: './media-bookmark-search.component.html',
  styleUrl: './media-bookmark-search.component.css',
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

  override initSelectors(): void {}
  override initSubscriptions(): void {}
}
