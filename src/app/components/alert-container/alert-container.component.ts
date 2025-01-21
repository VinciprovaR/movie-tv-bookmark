import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationStart } from '@angular/router';
import { filter, Observable, takeUntil } from 'rxjs';
import { NotifierStore } from '../../core/component-store/notifier-store.service';
import { AbstractComponent } from '../../shared/abstract/components/abstract-component.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alert-container.component.html',
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
