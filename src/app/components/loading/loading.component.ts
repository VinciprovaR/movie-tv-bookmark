import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent extends AbstractComponent implements OnInit {
  readonly loadingService = inject(LoadingService);

  toggleIsLoading$ = this.loadingService.toggleIsLoading$;

  @ViewChild('loadingBar')
  loadingBar!: ElementRef;
  @ViewChild('loadingBarLanding')
  loadingBarLanding!: ElementRef;
  evaluateToggle: any = {
    true: { remove: 'hidden', add: 'block' },
    false: { remove: 'block', add: 'hidden' },
  };

  constructor() {
    super();
  }
  ngOnInit(): void {
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
        this.loadingBarLanding.nativeElement,
        this.evaluateToggle[isLoading.toString()].remove
      );
      this.renderer.addClass(
        this.loadingBarLanding.nativeElement,
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
