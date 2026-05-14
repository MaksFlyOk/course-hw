import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonType, ButtonVariant } from '@components/shared/button/button.type';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { SearchSelectImages } from '@components/shared/search-select-images/search-select-images';
import { ISearchSelectImagesOptions } from '@components/shared/search-select-images/search-select-images.type';
import { SearchSelectWithCreate } from '@components/shared/search-select-with-create/search-select-with-create';
import { ISearchSelectWithCreateOptions } from '@components/shared/search-select-with-create/search-select-with-create.type';
import { IArticle } from '@models/article.model';
import { IAddArticleData } from '@pages/blog-page/article-form/article-data.type';
import { ArticleFormVariants } from '@pages/blog-page/article-form/article-form-variants';
import { optionsImagesData } from '@pages/blog-page/article-form/options-images.data';
import { UpdateCategoryModal } from '@pages/blog-page/article-form/update-category-modal/update-category-modal';
import { IUpdateCategoryModalForm } from '@pages/blog-page/article-form/update-category-modal/update-category-modal-form.type';
import { CategoriesRepository } from '@services/categories/categories-repository.service';
import { CATEGORIES_REPOSITORY_TOKEN } from '@services/categories/categories-repository.token';
import { CategoriesStoreService } from '@services/categories/categories-store.service';
import { FormHandlerService } from '@services/form-handler-service/form-handler-service';

@Component({
  selector: 'blog-app-article-form',
  standalone: true,
  imports: [Button, FormField, ReactiveFormsModule, SearchSelectImages, SearchSelectWithCreate, UpdateCategoryModal],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
  providers: [CategoriesStoreService, { provide: CATEGORIES_REPOSITORY_TOKEN, useClass: CategoriesRepository }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormHandlerService);
  private readonly categoriesStore = inject(CategoriesStoreService);
  private readonly categoriesService = inject(CATEGORIES_REPOSITORY_TOKEN);

  private currentEditingId: string | undefined = undefined;
  protected readonly buttonVariant = ButtonVariant;
  protected readonly buttonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
  protected readonly optionsImage = signal<ISearchSelectImagesOptions[]>(optionsImagesData);
  protected readonly isLoading = signal(false);
  protected readonly formVariant = signal(ArticleFormVariants.Add);
  protected readonly categories = computed<ISearchSelectWithCreateOptions[]>(() =>
    this.categoriesStore.categories().map((category) => {
      return {
        id: category.id,
        label: category.name,
        value: category.name,
      };
    }),
  );
  protected readonly isCategoriesLoading = this.categoriesStore.isLoading;
  protected readonly isAddNewCategoryLoading = this.categoriesStore.isAddNewCategoryLoading;
  protected readonly isUpdateCategoryLoading = this.categoriesStore.isUpdateCategoryLoading;
  protected readonly ArticleFormVariants = ArticleFormVariants;
  public readonly isOpen = signal(false);
  public readonly editArticleData = input<IArticle>();
  public readonly submitted = output<any>();

  private readonly updateCategoryModal = viewChild.required(UpdateCategoryModal);

  protected readonly articleForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(25)]],
    content: ['', [Validators.required]],
    imgSrc: ['', Validators.required],
    categoryId: ['', [Validators.required]],
  });

  ngOnInit() {
    this.categoriesService.loadCategories();
  }

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
          content: data.content,
          imgSrc: data.imgSrc,
          categoryId: data.categoryId,
        });
      } else if (this.formVariant() === ArticleFormVariants.Add) {
        this.articleForm.reset();
      }
    });
  }

  private scrollToForm(): void {
    setTimeout(() => {
      document.getElementById('add-article-anchor')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  protected openUpdateCategoryModal(categoryId: string): void {
    const category = this.categories().find((category) => category.id === categoryId);

    if (category) {
      this.updateCategoryModal()?.openUpdateCategoryModal(category.id, category.value);
    }
  }

  protected async updateCategory(newCategory: IUpdateCategoryModalForm) {
    await this.categoriesService.updateCategory(newCategory.newCategoryName, newCategory.categoryId);
  }

  protected deleteCategory(categoryId: string): void {
    this.categoriesService.deleteCategory(categoryId);
  }

  protected async onSubmit() {
    const rawData = this.articleForm.getRawValue();
    const result =
      this.formVariant() === ArticleFormVariants.Edit ? { ...rawData, id: this.editArticleData()?.id } : rawData;

    let categoryId: string = rawData.categoryId;

    if (!this.categoriesStore.categories().find((category) => category.id === categoryId)) {
      categoryId = await this.createCategory(result.categoryId);
    }

    await this.formService.processSubmit<IAddArticleData>(this.articleForm, this.isLoading, () => {
      this.submitted.emit({ ...result, categoryId });
      this.onReset();
    });
  }

  protected async createCategory(name: string) {
    return await this.categoriesService.addCategory(name);
  }

  protected onReset(): void {
    this.articleForm.reset();
    this.isOpen.set(false);
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
}
