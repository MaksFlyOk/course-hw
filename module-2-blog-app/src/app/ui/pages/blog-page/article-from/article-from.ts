import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonType, ButtonVariant } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { FormHandlerService } from '@core/services/form-handler-service/form-handler-service';
import { Article } from '@models/article.model';
import { ArticleFormVariants } from '@pages/blog-page/article-from/article-form-variants';

@Component({
  selector: 'blog-app-article-form',
  standalone: true,
  imports: [Button, FormField, ReactiveFormsModule],
  templateUrl: './article-from.html',
  styleUrl: './article-from.scss',
})
export class ArticleForm {
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormHandlerService);

  private currentEditingId: string | undefined = undefined;
  protected readonly buttonVariant = ButtonVariant;
  protected readonly buttonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
  protected readonly isLoading = signal(false);
  protected readonly formVariant = signal(ArticleFormVariants.Add);
  public readonly isOpen = signal(false);
  public readonly editArticleData = input<Article>();
  public readonly submitted = output<any>();

  protected readonly articleForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(25)]],
    description: ['', [Validators.required]],
  });

  protected readonly articleFormTitles: Record<ArticleFormVariants, string> = {
    [ArticleFormVariants.Add]: 'Добавить статью',
    [ArticleFormVariants.Edit]: 'Изменить статью',
  };
  protected readonly articleFormButtonSubmitTitles: Record<ArticleFormVariants, string> = {
    [ArticleFormVariants.Add]: 'Добавить',
    [ArticleFormVariants.Edit]: 'Сохранить',
  };

  constructor() {
    effect(() => {
      const data = this.editArticleData();

      if (data && this.formVariant() === ArticleFormVariants.Edit) {
        this.articleForm.patchValue({
          title: data.title,
          description: data.description,
        });
      } else if (this.formVariant() === ArticleFormVariants.Add) {
        this.articleForm.reset();
      }
    });
  }

  public toggleForm(variant: ArticleFormVariants, articleId?: string): void {
    const isEditMode = this.formVariant() === ArticleFormVariants.Edit;
    const isAddMode = this.formVariant() === ArticleFormVariants.Add;

    if (this.isOpen()) {
      if (isAddMode && variant === ArticleFormVariants.Add) {
        this.isOpen.set(false);
        return;
      }

      if (isEditMode && variant === ArticleFormVariants.Edit && this.currentEditingId === articleId) {
        this.isOpen.set(false);
        this.currentEditingId = undefined;
        return;
      }
    }

    this.currentEditingId = articleId;
    this.formVariant.set(variant);
    this.isOpen.set(true);

    this.scrollToForm();
  }

  private scrollToForm(): void {
    setTimeout(() => {
      document.getElementById('add-article-anchor')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  protected async onSubmit() {
    await this.formService.processSubmit(this.articleForm, this.isLoading, () => {
      const rawData = this.articleForm.getRawValue();
      const result =
        this.formVariant() === ArticleFormVariants.Edit ? { ...rawData, id: this.editArticleData()?.id } : rawData;

      this.submitted.emit(result);
      this.onReset();
    });
  }

  protected onReset(): void {
    this.articleForm.reset();
    this.isOpen.set(false);
  }
}
