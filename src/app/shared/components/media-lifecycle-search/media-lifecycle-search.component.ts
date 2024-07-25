import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  RouterModule,
  RouterLinkActive,
  ActivatedRoute,
} from '@angular/router';
import { BridgeDataService } from '../../services/bridge-data.service';
import { NavigatorComponent } from '../lifecycle-navigator/lifecycle-navigator.component';
import {
  LifecycleNavElement,
  LinkPath,
} from '../../interfaces/navigator.interface';
import { LIFECYCLE_NAV_ELEMENTS } from '../../../providers';

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
  readonly lifecycleNavElements: LifecycleNavElement[] = inject(
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
