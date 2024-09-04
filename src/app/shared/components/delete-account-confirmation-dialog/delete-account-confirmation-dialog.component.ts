import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractDialogComponent,
  SubmitDialog,
  submitDialogType,
} from '../abstract/abstract-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AbstractAuthComponent } from '../abstract/abstract-auth.component';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-delete-account-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule],
  templateUrl: './delete-account-confirmation-dialog.component.html',
  styleUrl: './delete-account-confirmation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountConfirmationDialogComponent
  extends AbstractDialogComponent
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  override initSelectors(): void {}
  override initSubscriptions(): void {
    this.pageEventService.resizeEvent$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.onWindowResize();
      });
  }

  override initContent() {
    if (this.overlayRef) {
      const portal = new ComponentPortal(DeleteAccountDialogContentComponent);

      const intance = this.overlayRef.attach(portal);

      intance.instance.submitDialogContentEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe((submit: SubmitDialog) => {
          if (submit.typeSubmit === 'confirm') {
            this.submitDialogEmitter.emit(submit);
          } else {
            this.closeOverlay();
          }
        });
    }
  }
}

@Component({
  selector: 'app-confirmation-dialog-content',
  standalone: true,
  imports: [
    MatIconModule,
    OverlayModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDivider,
  ],
  templateUrl: 'delete-account-dialog-content.component.html',
  styleUrl: './delete-account-confirmation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountDialogContentComponent extends AbstractAuthComponent {
  @Output()
  submitDialogContentEmitter = new EventEmitter<SubmitDialog>();

  passwordValidationForm!: FormGroup<{ password: FormControl<string> }>;
  submitted = false;

  constructor() {
    super();
  }

  confirm(password: string) {
    this.submitDialog('confirm', password);
  }

  cancel() {
    this.submitDialog('cancel');
  }

  private submitDialog(submit: submitDialogType, password?: string) {
    this.submitDialogContentEmitter.emit({
      typeSubmit: submit,
      payload: password,
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.initSelectors();
    this.initSubscriptions();
  }

  buildForm() {
    this.passwordValidationForm = new FormGroup<{
      password: FormControl<string>;
    }>({
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  override initSelectors(): void {}

  override initSubscriptions(): void {
    this.passwordValidationForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isFormValid = status === 'INVALID' ? false : true;
      });
  }

  get isPasswordError() {
    return (
      this.submitted &&
      this.passwordValidationForm.get('password')?.hasError('required')
    );
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.passwordValidationForm.valid) {
      this.isFormValid = true;
      this.confirm(
        this.passwordValidationForm.value.password
          ? this.passwordValidationForm.value.password
          : ''
      );
    } else {
      this.errorContainerTransition();
      this.isFormValid = false;
    }
  }
}
