import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';

import { Button } from '@components/shared/button/button';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';

@Component({
  selector: 'blog-app-feedback-from',
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './feedback-from.html',
  styleUrl: './feedback-from.scss',
})
export class FeedbackFrom {
  private readonly fb = inject(FormBuilder);
  protected readonly form = form;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Dark;
  public readonly submitted = output<any>();

  protected readonly articleForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(30)]],
  });

  protected onSubmit(): void {
    if (this.articleForm.valid) {
      this.submitted.emit(this.articleForm.value);
      this.articleForm.reset();
    }
  }
}
