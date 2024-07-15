import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  RouterModule,
  RouterLinkActive,
  ActivatedRoute,
} from '@angular/router';
import { BridgeDataService } from '../../services/bridge-data.service';
import { NavigatorComponent } from '../navigator/navigator.component';
import { LinkPath } from '../../interfaces/navigator.interface';

@Component({
  selector: 'app-media-lifecycle-search',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLinkActive, NavigatorComponent],
  providers: [BridgeDataService],
  templateUrl: './media-lifecycle-search.component.html',
  styleUrl: './media-lifecycle-search.component.css',
})
export class MediaLifecycleSearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  title: string = '';

  readonly LINK_PATH_LIST: LinkPath[] = [
    { label: 'Watchlist Lifecycle', path: 'watchlist' },
    { label: 'Watched Lifecycle', path: 'watched' },
    { label: 'Rewatch Lifecycle', path: 'rewatch' },
    { label: 'Still Watching Lifecycle', path: 'stillWatching' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.title = this.route.snapshot.routeConfig?.title
      ? this.route.snapshot.routeConfig.title.toString()
      : '';
  }
}
