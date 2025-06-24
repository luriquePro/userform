import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  inject,
  Input,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedIconsModule } from '../../shared/shared-icons.module';

type InputType = 'text' | 'email' | 'password';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedIconsModule],
  viewProviders: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormInputComponent,
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @Input() label: string = '';
  @Input() type: InputType = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() helpText = '';
  @Input() inputId = `input-${Math.random().toString(36)}`;
  @Input() class = '';
  @Input() minLength = 0;
  @Input() maxLength = 0;

  value = '';
  isFocused = false;
  showPassword = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur() {
    setTimeout(() => (this.isFocused = false), 200);
    this.onTouched();
  }

  clearContent() {
    this.value = '';
    this.onChange(this.value);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get inputType(): string {
    return this.type === 'password' && this.showPassword ? 'text' : this.type;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get control() {
    return this.ngControl?.control;
  }

  get hasError(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.touched || this.control.dirty)
    );
  }

  getErrorMessage(): string {
    if (!this.control) return '';

    const errors = this.control.errors;

    if (!errors) return '';

    if (errors['required']) return 'Este campo é obrigatório.';
    if (errors['minlength'])
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength'])
      return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['email']) return 'Formato de e-mail inválido.';
    if (errors['lowercase']) return 'Informe pelo menos uma letra minúscula.';
    if (errors['uppercase']) return 'Informe pelo menos uma letra maiúscula.';
    if (errors['special']) return 'Informe pelo menos um caractere especial.';
    if (errors['passwordMismatch']) return 'As senhas não coincidem.';

    return 'Campo inválido.';
  }
}
