import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { AuthSelectors } from '../../core/store/auth';
import { HEADER_NAV_ELEMENTS } from '../../providers';
import { ToggleThemeService } from '../../services/toggle-theme.service';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';
import { NavigatorDesktopComponent } from '../../shared/components/navigator-desktop/navigator-desktop.component';
import { NavigatorMobileComponent } from '../../shared/components/navigator-mobile/navigator-mobile.component';
import { ToggleThemeButtonComponent } from '../../shared/components/toggle-theme-button/toggle-theme-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    NavigatorMobileComponent,
    NavigatorDesktopComponent,
    AppLogoComponent,
    ToggleThemeButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent extends AbstractComponent implements OnInit {
  private readonly toggleThemeService = inject(ToggleThemeService);
  readonly navElements = inject(HEADER_NAV_ELEMENTS);

  readonly isUserAuthenticated$ = this.store
    .select(AuthSelectors.selectUser)
    .pipe(map((user) => !!user));

  icon = '';
  isDarkTheme = false;
  showNavMenuMobile: boolean = false;
  $isScrolled: WritableSignal<boolean> = signal(false);
  private lastScrollTop = 0;

  constructor() {
    super();
    this.registerEffects();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', (e) => {
      //this.windowScrollEvent();
      this.onWindowScroll();
    });
  }

  registerEffects() {
    effect(() => {
      this.isDarkTheme = this.toggleThemeService.$isDarkTheme();
      this.icon = this.toggleThemeService.$icon();
    });
  }

  // //@HostListener('window:scroll', ['$event.target'])
  // windowScrollEvent() {
  //   let scrollTop = window.document.documentElement.scrollTop;
  //   if (scrollTop > this.lastScrollTop) {
  //     if (scrollTop - this.lastScrollTop > 1) {
  //       this.renderer.addClass(this.el.nativeElement.firstChild, 'header-up');
  //       if (this.showNavMenuMobile) {
  //         this.toggleNavMenuMobile();
  //       }
  //     }
  //   } else if (this.lastScrollTop - scrollTop > 1) {
  //     this.renderer.removeClass(this.el.nativeElement.firstChild, 'header-up');
  //   }
  //   this.lastScrollTop = scrollTop;
  // }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.$isScrolled.set(scrollTop > 0);
  }

  toggleNavMenuMobile() {
    this.showNavMenuMobile = !this.showNavMenuMobile;
    this.changeDetectorRef.detectChanges();
  }

  closeNavMenuMobile() {
    this.showNavMenuMobile = false;
    this.changeDetectorRef.detectChanges();
  }
}
