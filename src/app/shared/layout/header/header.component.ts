import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { map, Observable } from 'rxjs';
import { AuthSelectors } from '../../store/auth';
import { ToggleThemeStore } from '../../store/component-store/toggle-theme-store.service';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavigatorMobileComponent } from '../../../features/navigator-mobile/navigator-mobile.component';
import { NavigatorDesktopComponent } from '../../../features/navigator-desktop/navigator-desktop.component';
import { HEADER_NAV_ELEMENTS } from '../../../providers';
import { AbstractComponent } from '../../components/abstract/abstract-component.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterModule,
    MatIconModule,
    NavigatorMobileComponent,
    NavigatorDesktopComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends AbstractComponent implements OnInit {
  private readonly toggleThemeStore = inject(ToggleThemeStore);
  readonly navElements = inject(HEADER_NAV_ELEMENTS);

  isUserAuthenticated$!: Observable<boolean>;
  icon$!: Observable<string>;
  isDarkTheme$!: Observable<boolean>;
  toggleThemeIcon: string = '';
  hiddenNavMenu: boolean = true;
  private lastScrollTop = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initSelectors();

      window.addEventListener('scroll', (e) => {
        this.windowScrollEvent();
      });
    });
  }

  override initSelectors() {
    this.icon$ = this.toggleThemeStore.selectIcon$;
    this.isDarkTheme$ = this.toggleThemeStore.selectIsDarkTheme$;
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }

  override initSubscriptions(): void {}

  //@HostListener('window:scroll', ['$event.target'])
  windowScrollEvent() {
    let scrollTop = window.document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      this.renderer.addClass(this.el.nativeElement.firstChild, 'header-up');
      if (!this.hiddenNavMenu) {
        this.toggleNavMenuMobile();
      }
    } else {
      this.renderer.removeClass(this.el.nativeElement.firstChild, 'header-up');
    }
    this.lastScrollTop = scrollTop;
  }

  toggleTheme() {
    this.toggleThemeStore.toggleTheme();
  }

  toggleNavMenuMobile() {
    this.hiddenNavMenu = !this.hiddenNavMenu;
    this.changeDetectorRef.detectChanges();
  }
}
