import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import {
  Alert,
  AlertStore,
} from '../../shared/store/component-store/alert-store.service';
import { filter, Observable } from 'rxjs';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './alert-container.component.html',
  styleUrl: './alert-container.component.css',
})
export class AlertContainerComponent implements OnInit {
  alerts$!: Observable<any>;

  constructor(private alertStore: AlertStore, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.alerts$ = this.alertStore.alerts$;
  }

  closeAlert(id: number) {
    this.alertStore.closeAlert(id);
  }
}
