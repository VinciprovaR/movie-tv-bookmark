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
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navigator-desktop',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navigator-desktop.component.html',
  styleUrl: './navigator-desktop.component.css',
})
export class NavigatorDesktopComponent implements OnInit {
  private renderer!: Renderer2;
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly router = inject(Router);

  destroyed$ = new Subject();

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
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        this.hideSubMenuStart();
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
}
