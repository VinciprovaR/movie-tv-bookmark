import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NotifierStore } from '../../shared/store/component-store/notifier-store.service';
import { filter, Observable, Subject, takeUntil, timer } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { NavigationStart, Router } from '@angular/router';
import { AbstractComponent } from '../../shared/components/abstract/abstract-component.component';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alert-container.component.html',
  styleUrl: './alert-container.component.css',
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
    this.router.events
      .pipe(
        takeUntil(this.destroyed$),
        filter((event) => event instanceof NavigationStart)
      )
      .subscribe((event) => {
        this.cleanAlert();
      });

    this.initSelectors();
  }

  override initSelectors() {
    this.selectAlerts$ = this.notifierStore.selectAlerts$;
  }
  override initSubscriptions(): void {}

  closeAlert(id: number) {
    this.notifierStore.closeAlert(id);
  }

  cleanAlert() {
    this.notifierStore.cleanAlerts();
  }
}
