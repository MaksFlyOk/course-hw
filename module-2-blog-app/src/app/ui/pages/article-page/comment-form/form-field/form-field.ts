import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/*
 Компонент был создан исключительно для формы на странице статьи,
 в связи с версткой Angular Material и дублирует существующий компонент
 */

@Component({
  selector: 'blog-app-form-field',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  public readonly label = input.required<string>();
  public readonly placeholder = input<string>('');
  public readonly icon = input<string>('');
  public readonly type = input<'input' | 'textarea'>('input');
  public readonly control = input.required<FormControl>();

  protected get errorMessage(): string {
    const errors = this.control().errors;
    if (!errors) return '';

    if (errors['required']) return 'Обязательное поле';
    if (errors['minlength']) return `Минимальная длина ${errors['minlength']?.requiredLength} символов`;
    if (errors['maxlength']) return `Максимальная длина ${errors['maxlength']?.requiredLength} символов`;

    return 'Неверное значение';
  }
}
