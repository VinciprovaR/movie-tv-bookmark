import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierStore } from '../../shared/component-store';
import { filter, Observable, takeUntil } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { NavigationStart } from '@angular/router';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alert-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertContainerComponent
  extends AbstractComponent
  implements OnInit
{
  readonly notifierStore = inject(NotifierStore);
  selectAlerts$!: Observable<any>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
    this.initSelectors();
  }

  initSelectors() {
    this.selectAlerts$ = this.notifierStore.selectAlerts$;
  }
  initSubscriptions(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        this.cleanAlert();
      });
  }

  closeAlert(id: number) {
    this.notifierStore.closeAlert(id);
  }

  cleanAlert() {
    this.notifierStore.cleanAlerts();
  }
}
