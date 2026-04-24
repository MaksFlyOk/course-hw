import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonType, ButtonVariant } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { simulateNetworkDelay } from '@core/utils/simulate-network-delay';

@Component({
  selector: 'blog-app-add-article-form',
  standalone: true,
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './add-article-from.html',
  styleUrl: './add-article-from.scss',
})
export class AddArticleForm {
  private readonly fb = inject(FormBuilder);
  protected readonly buttonVariant = ButtonVariant;
  protected readonly buttonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
  protected isLoading = signal(false);
  public readonly isOpen = signal(false);
  public readonly submitted = output<any>();

  protected readonly articleForm = this.fb.group({
    title: ['', [Validators.required]],
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
    if (this.articleForm.valid) {
      this.setEnabledForm(false);
      this.isLoading.set(true);

      await simulateNetworkDelay(10_000);

      this.isLoading.set(false);

      this.submitted.emit(this.articleForm.getRawValue());
      this.onReset();
      this.setEnabledForm(true);
    }
  }

  private setEnabledForm(enabled: boolean): void {
    if (enabled) {
      this.articleForm.enable();
    } else {
      this.articleForm.disable();
    }
  }

  protected onReset(): void {
    this.articleForm.reset();
    this.isOpen.set(false);
    this.isLoading.set(false);
  }
}
