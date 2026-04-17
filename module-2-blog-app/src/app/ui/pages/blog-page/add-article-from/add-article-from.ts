import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonVariant } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';

@Component({
  selector: 'blog-app-add-article-form',
  standalone: true,
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './add-article-from.html',
  styleUrl: './add-article-from.scss',
})
export class AddArticleForm {
  private readonly fb = inject(FormBuilder);
  public readonly isOpen = signal(false);
  readonly submitted = output<any>();

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

  protected onSubmit(): void {
    if (this.articleForm.valid) {
      this.submitted.emit(this.articleForm.getRawValue());
      this.onReset();
    }
  }

  protected onReset(): void {
    this.articleForm.reset();
    this.isOpen.set(false);
  }

  protected readonly ButtonVariant = ButtonVariant;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
}
