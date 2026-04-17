import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FormFieldType, FormTheme } from './form-field.type';

@Component({
  selector: 'blog-app-form-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly type = input<FormFieldType>(FormFieldType.Text);
  readonly theme = input<FormTheme>(FormTheme.Light);
  readonly control = input.required<FormControl>();
}
