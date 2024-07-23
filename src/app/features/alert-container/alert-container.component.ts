import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NotifierStore } from '../../shared/store/component-store/notifier-store.service';
import { filter, Observable, Subject, takeUntil, timer } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alert-container.component.html',
  styleUrl: './alert-container.component.css',
})
export class AlertContainerComponent implements OnInit {
  readonly notifierStore = inject(NotifierStore);
  readonly router = inject(Router);
  private readonly destroyRef$ = inject(DestroyRef);

  destroyed$ = new Subject();

  selectAlerts$!: Observable<any>;

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
        this.cleanAlert();
      });

    this.initSelectors();
  }

  initSelectors() {
    this.selectAlerts$ = this.notifierStore.selectAlerts$;
  }

  closeAlert(id: number) {
    this.notifierStore.closeAlert(id);
  }

  cleanAlert() {
    this.notifierStore.cleanAlerts();
  }
}
