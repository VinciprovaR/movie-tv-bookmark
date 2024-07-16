import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'alert.component.html',
  styleUrl: 'alert.component.css',
})
export class AlertComponent implements OnInit {
  private readonly destroyRef$ = inject(DestroyRef);
  destroyed$ = new Subject();

  @Input({ required: true })
  id!: number;
  @Input({ required: true })
  message!: string;
  @Input({ required: true })
  type!: 'error' | 'success';

  @Output()
  closeAlert = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    timer(7000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.onClose());
  }

  onClose(): void {
    this.closeAlert.emit(this.id);
  }
}
