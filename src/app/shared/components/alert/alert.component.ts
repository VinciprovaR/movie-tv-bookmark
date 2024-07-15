import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'alert.component.html',
  styleUrl: 'alert.component.css',
})
export class AlertComponent {
  @Input({ required: true })
  id!: number;
  @Input({ required: true })
  message!: string;
  @Input({ required: true })
  type!: 'error' | 'success';

  @Output()
  closeAlert = new EventEmitter<number>();

  constructor() {}

  onClose(): void {
    this.closeAlert.emit(this.id);
  }
}
