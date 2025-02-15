import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { AbstractAuthComponent } from '../../abstract/components/abstract-auth.component';
import { AbstractDialogComponent } from '../../abstract/components/abstract-dialog.component';
import {
  SubmitDialog,
  submitDialogType,
} from '../../interfaces/layout.interface';
import { DeleteAccountForm } from '../../interfaces/supabase/supabase-auth.interface';

@Component({
  selector: 'app-delete-account-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule, OverlayModule],
  templateUrl: './delete-account-confirmation-dialog.component.html',
})
export class DeleteAccountConfirmationDialogComponent extends AbstractDialogComponent {
  constructor() {
    super();
    this.registerEffects();
  }

  registerEffects() {
    effect(() => {
      this.pageEventService.$windowInnerHeight();
      this.pageEventService.$windowInnerWidth();
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
  ],
  templateUrl: 'delete-account-dialog-content.component.html',
})
export class DeleteAccountDialogContentComponent extends AbstractAuthComponent {
  @Output()
  submitDialogContentEmitter = new EventEmitter<SubmitDialog>();

  passwordValidationForm!: FormGroup<DeleteAccountForm>;
  submitted = false;

  randomPrompt!: string;
  labelRandomPrompt!: string;

  private readonly prompts = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'Pulp Fiction',
    'Forrest Gump',
    'Inception',
    'The Matrix',
    'Fight Club',
    'Star Wars',
    'Titanic',
    'Jurassic Park',
    'The Silence of the Lambs',
    "Schindler's List",
    'The Lion King',
    'Gladiator',
    'Back to the Future',
    'Saving Private Ryan',
    'The Avengers',
    'Raiders of the Lost Ark',
    'Breaking Bad',
    'Game of Thrones',
    'Friends',
    'Stranger Things',
    'The Office',
    'The Simpsons',
    'The Sopranos',
    'Sherlock',
    'The Walking Dead',
    'Seinfeld',
    'Better Call Saul',
    'House of Cards',
    'The Mandalorian',
    'Lost',
    'Westworld',
  ];

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
    this.generateRandomPrompt();
    this.buildForm();

    this.initSubscriptions();
  }

  generateRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * this.prompts.length);
    this.randomPrompt = this.prompts[randomIndex];
    this.labelRandomPrompt = `To confirm, type  "${this.randomPrompt}"  in the box below`;
  }

  buildForm() {
    this.passwordValidationForm = new FormGroup<DeleteAccountForm>({
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      securityPrompt: new FormControl<string>('', {
        validators: [Validators.required, this.isPromptValid.bind(this)],
        nonNullable: true,
      }),
    });
  }

  initSubscriptions(): void {
    this.passwordValidationForm.statusChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status: string) => {
        this.isFormValid = status === 'VALID';
      });
  }

  get isPasswordError() {
    return (
      this.submitted &&
      this.passwordValidationForm.get('password')?.hasError('required')
    );
  }

  get isSecurityPromptError() {
    return (
      this.submitted &&
      (this.passwordValidationForm
        .get('securityPrompt')
        ?.hasError('required') ||
        this.passwordValidationForm
          .get('securityPrompt')
          ?.hasError('invalidPrompt'))
    );
  }

  isPromptValid(control: AbstractControl<string>): ValidationErrors | null {
    return control.value != this.randomPrompt ? { invalidPrompt: true } : null;
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
