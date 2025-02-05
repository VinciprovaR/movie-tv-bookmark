import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';
import { LoadingService } from '../../../services/loading.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent extends AbstractComponent implements OnInit {
  readonly loadingService = inject(LoadingService);
  toggleIsLoading$ = this.loadingService.toggleIsLoading$;

  @ViewChild('loadingBar')
  loadingBar!: ElementRef;
  @ViewChild('preloaderOverlay')
  preloaderOverlay!: ElementRef;
  evaluateToggle: any = {
    true: { remove: 'hidden', add: 'block' },
    false: { remove: 'block', add: 'hidden' },
  };
  $isHome: WritableSignal<boolean> = signal(false);

  constructor() {
    super();
  }
  ngOnInit(): void {
    console.log(this.router.url);
    this.router.url === '/' ? this.$isHome.set(true) : this.$isHome.set(false);

    this.initSubscriptions();
  }

  initSubscriptions() {
    this.toggleIsLoading$.subscribe(
      (toggle: { isLoading: boolean; isLanding: boolean }) => {
        let { isLoading, isLanding } = toggle;
        this.toggleIsLoading(isLoading, isLanding);
      }
    );
  }

  toggleIsLoading(isLoading: boolean, isLanding: boolean = false) {
    if (isLanding) {
      this.renderer.removeClass(
        this.preloaderOverlay.nativeElement,
        this.evaluateToggle[isLoading.toString()].remove
      );
      this.renderer.addClass(
        this.preloaderOverlay.nativeElement,
        this.evaluateToggle[isLoading.toString()].add
      );
    }
    this.renderer.removeClass(
      this.loadingBar.nativeElement,
      this.evaluateToggle[isLoading.toString()].remove
    );
    this.renderer.addClass(
      this.loadingBar.nativeElement,
      this.evaluateToggle[isLoading.toString()].add
    );
  }
}
