import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavElements } from '../../shared/interfaces/navigator.interface';
import { NavigationStart, RouterLink, RouterLinkActive } from '@angular/router';

import { AbstractNavComponent } from '../../shared/components/abstract/abstract-nav.component';
import { takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-navigator-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-mobile.component.html',
  styleUrl: './navigator-mobile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorMobileComponent
  extends AbstractNavComponent
  implements OnInit
{
  @Input({ required: true })
  navElements!: NavElements;
  @Input({ required: true })
  hiddenNavMenu: boolean = true;
  @Output()
  toggleNavMenuMobile = new EventEmitter<null>();
  @Output()
  closeNavMenuMobile = new EventEmitter<null>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        this.closeNavMenuMobile.emit(null);
      });
  }
}
