import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  public readonly type = input<FormFieldType>(FormFieldType.Text);
  public readonly theme = input<FormTheme>(FormTheme.Light);
  public readonly control = input.required<FormControl>();
}
