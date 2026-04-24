import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonType, ButtonVariant } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { FormHandlerService } from '@core/services/form-handler-service/form-handler-service';

@Component({
  selector: 'blog-app-add-article-form',
  standalone: true,
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './article-from.html',
  styleUrl: './article-from.scss',
})
export class AddArticleForm {
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormHandlerService);

  protected readonly buttonVariant = ButtonVariant;
  protected readonly buttonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
  protected isLoading = signal(false);
  public readonly isOpen = signal(false);
  public readonly submitted = output<any>();

  protected readonly articleForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(25)]],
    content: ['', [Validators.required]],
  });

  public toggleForm(): void {
    this.isOpen.update((value) => !value);

    if (this.isOpen()) {
      setTimeout(() => {
        document.getElementById('add-article-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  protected async onSubmit() {
    await this.formService.processSubmit(
      this.articleForm,
      this.isLoading,
      () => {
        this.submitted.emit(this.articleForm.getRawValue());
        this.isOpen.set(false);
      },
      5_000,
    );
  }

  protected onReset(): void {
    this.articleForm.reset();
    this.isOpen.set(false);
    this.isLoading.set(false);
  }
}
