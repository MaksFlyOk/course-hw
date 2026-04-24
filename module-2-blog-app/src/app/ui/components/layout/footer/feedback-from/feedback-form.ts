import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';

import { Button } from '@components/shared/button/button';
import { ButtonType } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';

@Component({
  selector: 'blog-app-feedback-form',
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.scss',
})
export class FeedbackForm {
  private readonly fb = inject(FormBuilder);

  protected readonly form = form;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Dark;
  protected isLoading = signal(false);
  public readonly submitted = output<any>();

  protected readonly feedbackFrom = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(30)]],
  });

  protected onSubmit(): void {
    if (this.feedbackFrom.valid) {
      this.setEnabledForm(false);
      this.isLoading.set(true);

      this.submitted.emit(this.feedbackFrom.value);
      this.feedbackFrom.reset();
    }
  }

  private setEnabledForm(enabled: boolean): void {
    if (enabled) {
      this.feedbackFrom.enable();
    } else {
      this.feedbackFrom.disable();
    }
  }

  protected readonly ButtonType = ButtonType;
}
