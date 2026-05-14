import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Modal } from '@components/modal/modal';
import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonType, ButtonVariant } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { IUpdateCategoryModalForm } from '@pages/blog-page/article-form/update-category-modal/update-category-modal-form.type';

@Component({
  selector: 'blog-app-update-category-modal',
  imports: [Modal, Button, FormField, ReactiveFormsModule],
  templateUrl: './update-category-modal.html',
  styleUrl: './update-category-modal.scss',
})
export class UpdateCategoryModal {
  private readonly fb = inject(FormBuilder);

  protected readonly buttonVariant = ButtonVariant;
  protected readonly buttonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
  protected readonly isUpdateCategoryModalOpen = signal(false);
  protected readonly category = signal<{ categoryId: string | null; categoryName: string | null }>({
    categoryId: null,
    categoryName: null,
  });
  public readonly created = output<IUpdateCategoryModalForm>();

  protected readonly updateCategoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
  });

  public openUpdateCategoryModal(categoryId: string, categoryName: string): void {
    this.isUpdateCategoryModalOpen.set(true);
    this.category.set({ categoryId, categoryName });
    this.updateCategoryForm.setValue({ name: categoryName });
  }

  protected closeUpdateCategoryModal(): void {
    this.isUpdateCategoryModalOpen.set(false);
  }

  protected onSubmit(): void {
    const newCategoryName = this.updateCategoryForm.getRawValue().name.trim();
    const categoryId = this.category().categoryId;

    if (!newCategoryName || !categoryId) {
      return;
    }

    this.created.emit({ newCategoryName, categoryId });
    this.onReset();
  }

  protected onReset(): void {
    this.closeUpdateCategoryModal();
    this.updateCategoryForm.reset();
  }
}
