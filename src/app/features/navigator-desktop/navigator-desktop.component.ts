import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { NavElements } from '../../shared/interfaces/navigator.interface';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-navigator-desktop',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigator-desktop.component.html',
  styleUrl: './navigator-desktop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorDesktopComponent implements OnInit {
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);

  destroyed$ = new Subject();
  urlAfterRedirects!: string;

  @Input({ required: true })
  navElements!: NavElements;
  subMenuRef!: HTMLElement;

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event: any) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        this.hideSubMenuStart();
      });

    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event: any) => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects)
      )
      .subscribe((urlAfterRedirects) => {
        this.urlAfterRedirects = urlAfterRedirects;
      });
  }
  showSubMenu(subMenu: HTMLElement) {
    this.subMenuRef = subMenu;
    this.renderer.addClass(subMenu, 'show-sub-menu');
  }

  hideSubMenu(subMenu: HTMLElement) {
    this.renderer.removeClass(subMenu, 'show-sub-menu');
  }

  hideSubMenuStart() {
    if (this.subMenuRef) {
      this.renderer.removeClass(this.subMenuRef, 'show-sub-menu');
    }
  }

  checkIsActive(navElementKey: string) {
    if (this.urlAfterRedirects) {
      return this.urlAfterRedirects.indexOf(navElementKey) != -1;
    }

    return false;
  }
}
