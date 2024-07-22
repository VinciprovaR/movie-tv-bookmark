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
import { NavigatorComponent } from '../../components/navigator/navigator.component';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthSelectors } from '../../store/auth';
import { LinkPath } from '../../interfaces/navigator.interface';
import { ToggleThemeStore } from '../../store/component-store/toggle-theme-store.service';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NavigatorComponent,
    RouterLinkActive,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly toggleThemeStore = inject(ToggleThemeStore);
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly destroyRef$ = inject(DestroyRef);

  destroyed$ = new Subject();

  toggleThemeIcon: string = '';

  isUserAuthenticated$!: Observable<boolean>;
  icon$!: Observable<string>;
  isDarkTheme$!: Observable<boolean>;

  private window!: Window;
  private lastScrollTop = 0;
  hiddenNavMenu: boolean = true;

  readonly linkList: { [key: string]: { key: string; subMenu: LinkPath[] } } = {
    movie: {
      key: 'Movie',
      subMenu: [
        { label: 'Search', path: 'movie' },
        { label: 'Discovery', path: 'discovery-movie' },
        { label: 'Bookmarks', path: 'movie-lifecycle-search' },
      ],
    },
    tv: {
      key: 'TV Shows',
      subMenu: [
        { label: 'Search', path: 'tv' },
        { label: 'Discovery', path: 'discovery-tv' },
        { label: 'Bookmarks', path: 'tv-lifecycle-search' },
      ],
    },
    userProfile: {
      key: 'User Profile',
      subMenu: [{ label: 'User Profile', path: 'user-profile' }],
    },
  };

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.window = window;
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.initSelectors();
  }

  initSelectors() {
    this.icon$ = this.toggleThemeStore.selectIcon$;
    this.isDarkTheme$ = this.toggleThemeStore.selectIsDarkTheme$;
    this.isUserAuthenticated$ = this.store
      .select(AuthSelectors.selectUser)
      .pipe(map((user) => !!user));
  }

  toggleTheme() {
    this.toggleThemeStore.toggleTheme();
  }

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    let scrollTop = this.window.document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      this.renderer.addClass(this.el.nativeElement.firstChild, 'header-up');
      if (!this.hiddenNavMenu) {
        this.toggleNavMenu();
      }
    } else {
      this.renderer.removeClass(this.el.nativeElement.firstChild, 'header-up');
    }
    this.lastScrollTop = scrollTop;
  }

  showSubMenu(event: any) {
    this.renderer.addClass(event, 'show');
  }

  hideSubMenu(event: any) {
    this.renderer.removeClass(event, 'show');
  }

  toggleNavMenu() {
    this.hiddenNavMenu = !this.hiddenNavMenu;
  }
}
