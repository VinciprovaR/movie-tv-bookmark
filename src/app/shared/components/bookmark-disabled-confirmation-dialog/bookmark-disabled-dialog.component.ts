import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AbstractDialogComponent } from '../abstract/abstract-dialog.component';
import { AbstractComponent } from '../abstract/abstract-component.component';
import { CommonModule } from '@angular/common';
import {
  scrollDirection,
  SubmitDialog,
  submitDialogType,
} from '../../interfaces/layout.interface';

@Component({
  selector: 'app-bookmark-disabled-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule, CommonModule],
  templateUrl: './bookmark-disabled-dialog.component.html',
  styleUrl: './bookmark-disabled-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkDisabledDialogComponent
  extends AbstractDialogComponent
  implements OnInit
{
  @Input({ required: true })
  direction: scrollDirection = 'none';
  @Input({ required: true })
  isDetail!: boolean;

  override positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
  ];

  constructor() {
    super();
  }
  ngOnInit(): void {
    this.initSubscriptions();
  }

  initSubscriptions(): void {
    this.pageEventService.resizeEvent$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.onWindowResize();
      });
  }

  override initContent() {
    if (this.overlayRef) {
      const portal = new ComponentPortal(
        BookmarkDisabledDialogContentComponent
      );

      const intance = this.overlayRef.attach(portal);

      intance.instance.submitDialogContentEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe((submit: SubmitDialog) => {
          this.closeOverlay();
        });
    }
  }
}

@Component({
  selector: 'app-bookmark-disabled-content',
  standalone: true,
  imports: [MatIconModule, OverlayModule, RouterLink],
  template: `<div class="p-4">
    <div class="p-4 overlay-bg rounded-md">
      <div>
        To use the bookmark feature
        <a
          (keyup)="cancel()"
          (click)="cancel()"
          [routerLink]="'/login'"
          class="font-medium"
        >
          Sign In</a
        >
        with your account, or
        <a
          (keyup)="cancel()"
          (click)="cancel()"
          [routerLink]="'/register'"
          class="font-medium"
          >Sign Up</a
        >
      </div>
    </div>
  </div> `,
  styleUrl: './bookmark-disabled-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkDisabledDialogContentComponent extends AbstractComponent {
  @Output()
  submitDialogContentEmitter = new EventEmitter<SubmitDialog>();

  constructor() {
    super();
  }

  cancel() {
    this.submitDialog('cancel');
  }

  private submitDialog(submit: submitDialogType) {
    this.submitDialogContentEmitter.emit({ typeSubmit: submit });
  }
}
