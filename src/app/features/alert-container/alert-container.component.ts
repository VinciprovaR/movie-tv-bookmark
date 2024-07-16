import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AlertStore } from '../../shared/store/component-store/alert-store.service';
import { filter, Observable, timer } from 'rxjs';
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
  readonly alertStore = inject(AlertStore);
  readonly router = inject(Router);

  selectAlerts$!: Observable<any>;

  constructor() {}
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.cleanAlert();
      });

    this.initSelectors();
  }

  initSelectors() {
    this.selectAlerts$ = this.alertStore.selectAlerts$;
  }

  closeAlert(id: number) {
    this.alertStore.closeAlert(id);
  }

  cleanAlert() {
    this.alertStore.cleanAlerts();
  }
}
