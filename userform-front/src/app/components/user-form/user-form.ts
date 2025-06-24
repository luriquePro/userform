import { FormInputComponent } from '../form-input/form-input';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;

  if (password && confirm && password !== confirm) {
    const confirmControl = group.get('confirmPassword');
    if (confirmControl) {
      confirmControl.setErrors({
        ...confirmControl.errors,
        passwordMismatch: true,
      });
    }
    return { passwordMismatch: true };
  } else {
    const confirmControl = group.get('confirmPassword');
    if (confirmControl && confirmControl.errors) {
      delete confirmControl.errors['passwordMismatch'];
      if (Object.keys(confirmControl.errors).length === 0) {
        confirmControl.setErrors(null);
      }
    }
    return null;
  }
}
@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './user-form.html',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    email: ['', [Validators.required, Validators.email]],
    passwordGroup: this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            (control: AbstractControl): ValidationErrors | null => {
              const value = control.value || '';
              const errors: ValidationErrors = {};

              if (!/[a-z]/.test(value)) errors['lowercase'] = true;
              if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
              if (!/\W/.test(value)) errors['special'] = true;

              return Object.keys(errors).length ? errors : null;
            },
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            (control: AbstractControl): ValidationErrors | null => {
              const value = control.value || '';
              const errors: ValidationErrors = {};

              if (!/[a-z]/.test(value)) errors['lowercase'] = true;
              if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
              if (!/\W/.test(value)) errors['special'] = true;

              return Object.keys(errors).length ? errors : null;
            },
          ],
        ],
      },
      { validators: passwordMatchValidator }
    ),
  });

  get f() {
    return this.form.controls;
  }
  get passwordGroup() {
    return this.form.get('passwordGroup') as FormGroup;
  }

  onSubmit(event: Event) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName, username, email } = this.form.value;
    const password = this.passwordGroup.get('password')?.value;

    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      username,
      email,
      password,
    };

    this.http.post(`${environment['apiUrl']}/users`, payload).subscribe({
      next: () => {
        alert('Usuário cadastrado com sucesso!');
        this.form.reset();
      },
      error: (err) => {
        alert('Erro ao cadastrar: ' + err.message);
      },
    });
  }
}
