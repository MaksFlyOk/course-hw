import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormFieldType, FormTheme } from './form-field.type';

@Component({
  selector: 'blog-app-form-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  public readonly id = input.required<string>();
  public readonly label = input.required<string>();
  public readonly placeholder = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly loading = input<boolean>(false);
  public readonly type = input<FormFieldType>(FormFieldType.Text);
  public readonly theme = input<FormTheme>(FormTheme.Light);
  public readonly control = input.required<FormControl>();

  protected getErrorsMessage(): string {
    const errors = this.control().errors;

    if (!errors) return '';

    const errorKeys = Object.keys(errors);
    const firstErrorKey = errorKeys[0];

    const messages: Record<string, string> = {
      required: 'Обязательное поле',
      email: 'Неверный email',
      minlength: `Минимальная длина ${errors['minlength']?.requiredLength} символов`,
      maxlength: `Максимальная длина ${errors['maxlength']?.requiredLength} символов`,
    };

    return messages[firstErrorKey] || 'Неверное значение';
  }
}
