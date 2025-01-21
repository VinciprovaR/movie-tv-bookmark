import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { takeUntil, timer } from 'rxjs';
import { AbstractComponent } from '../../abstract/components/abstract-component.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: 'alert.component.html',
  styleUrl: 'alert.component.css',
})
export class AlertComponent extends AbstractComponent implements OnInit {
  @ViewChild('alert')
  alert!: ElementRef;

  @Input({ required: true })
  id!: number;
  @Input({ required: true })
  message!: string;
  @Input({ required: true })
  type!: 'error' | 'success';

  @Output()
  closeAlert = new EventEmitter<number>();

  isVisible: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    timer(7000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.onClose());
  }

  onClose(): void {
    this.closeAlert.emit(this.id);
  }

  onShow() {
    this.renderer.removeClass(this.alert.nativeElement, 'hidden');

    this.renderer.addClass(this.alert.nativeElement, 'block');
  }
}
