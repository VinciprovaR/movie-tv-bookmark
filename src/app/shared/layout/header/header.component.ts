import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthSelectors } from '../../store/auth';
import { NavElements } from '../../interfaces/navigator.interface';
import { ToggleThemeStore } from '../../store/component-store/toggle-theme-store.service';
import {
  NavigationStart,
  Router,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavigatorMobileComponent } from '../../../features/navigator-mobile/navigator-mobile.component';
import { NavigatorDesktopComponent } from '../../../features/navigator-desktop/navigator-desktop.component';
import { HEADER_NAV_ELEMENTS } from '../../../providers';
import { PageEventService } from '../../services/page-event.service';

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
})
export class HeaderComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly toggleThemeStore = inject(ToggleThemeStore);
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  readonly navElements = inject(HEADER_NAV_ELEMENTS);
  readonly pageEventService = inject(PageEventService);

  destroyed$ = new Subject();
  isUserAuthenticated$!: Observable<boolean>;
  icon$!: Observable<string>;
  isDarkTheme$!: Observable<boolean>;

  toggleThemeIcon: string = '';

  hiddenNavMenu: boolean = true;
  private window!: Window;
  private lastScrollTop = 0;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        if (!this.hiddenNavMenu) {
          this.toggleNavMenuMobile();
        }
      });

    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.window = window;

    this.initSelectors();
  }

  initSelectors() {
    this.icon$ = this.toggleThemeStore.selectIcon$;
    this.isDarkTheme$ = this.toggleThemeStore.selectIsDarkTheme$;
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    let scrollTop = this.window.document.documentElement.scrollTop;
    // console.log(scrollTop, this.lastScrollTop);
    console.log(scrollTop - this.lastScrollTop);
    // let offSet = scrollTop - this.lastScrollTop;
    // if (offSet < 0) {
    //   offSet = -offSet;
    // }
    // console.log(offSet);

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
  }
}
