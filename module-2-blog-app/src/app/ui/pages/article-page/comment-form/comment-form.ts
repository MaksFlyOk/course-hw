import { Component, inject, model, output, viewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { IAddCommentData } from '@pages/article-page/comment-form/comment-data.type';
import { FormField } from '@pages/article-page/comment-form/form-field/form-field';
import { FormFieldType } from '@pages/article-page/comment-form/form-field/form-field.type';

@Component({
  selector: 'blog-app-comment-form',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormField,
  ],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
})
export class CommentForm {
  private readonly fb = inject(FormBuilder);

  protected readonly formFieldType = FormFieldType;
  protected isExpanded = model(false);
  public readonly submitted = output<IAddCommentData>();

  private readonly formDirective = viewChild.required<FormGroupDirective>('formDirective');

  protected readonly commentForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    content: ['', [Validators.required, Validators.minLength(50)]],
  });

  protected onSubmit(): void {
    if (this.commentForm.valid) {
      this.submitted.emit(this.commentForm.getRawValue());
      this.isExpanded.set(false);
      this.formDirective().resetForm();
    } else {
      this.commentForm.markAllAsTouched();
    }
  }
}
