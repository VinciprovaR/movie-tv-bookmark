import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationStart, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { AbstractNavComponent } from '../../abstract/components/abstract-nav.component';
import { NavElements } from '../../interfaces/navigator.interface';

@Component({
  selector: 'app-navigator-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorMobileComponent
  extends AbstractNavComponent
  implements OnInit
{
  @Input({ required: true })
  navElements!: NavElements;
  @Input({ required: true })
  showNavMenuMobile: boolean = false;
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
