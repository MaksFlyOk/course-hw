import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';

import { Button } from '@components/shared/button/button';
import { ButtonType } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { FormHandlerService } from '@core/services/form-handler-service/form-handler-service';

@Component({
  selector: 'blog-app-feedback-form',
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.scss',
})
export class FeedbackForm {
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormHandlerService);

  protected readonly form = form;
  protected readonly ButtonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Dark;
  protected isLoading = signal(false);
  public readonly submitted = output<any>();

  protected readonly feedbackFrom = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(30)]],
  });

  protected async onSubmit() {
    await this.formService.processSubmit(this.feedbackFrom, this.isLoading, () => {
      this.submitted.emit(this.feedbackFrom.value);
    });
  }
}
