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
import { DragAndDropImageField } from '@components/shared/drag-and-drop-image-field/drag-and-drop-image-field';
import { FormField } from '@components/shared/form-field/form-field';
import { FormFieldType, FormTheme } from '@components/shared/form-field/form-field.type';
import { SearchSelectImages } from '@components/shared/search-select-images/search-select-images';
import { SearchSelectWithCreate } from '@components/shared/search-select-with-create/search-select-with-create';
import { ISearchSelectWithCreateOptions } from '@components/shared/search-select-with-create/search-select-with-create.type';
import { CategoriesApi } from '@core/api/categories/categories.api';
import { IArticle } from '@models/article.model';
import { IAddArticleData } from '@pages/blog-page/article-form/article-data.type';
import { ArticleFormVariants } from '@pages/blog-page/article-form/article-form-variants';
import { optionsImagesData } from '@pages/blog-page/article-form/options-images.data';
import { UpdateCategoryModal } from '@pages/blog-page/article-form/update-category-modal/update-category-modal';
import { IUpdateCategoryModalForm } from '@pages/blog-page/article-form/update-category-modal/update-category-modal-form.type';
import { CategoriesHttpRepository } from '@services/categories/categories-http-repository.service';
import { CategoriesRepository } from '@services/categories/categories-repository.service';
import { CATEGORIES_REPOSITORY_TOKEN } from '@services/categories/categories-repository.token';
import { CategoriesStoreService } from '@services/categories/categories-store.service';
import { FormHandlerService } from '@services/form-handler-service/form-handler-service';

import { IENVconfig } from '../../../../../environments/environments.interface';
import { ENV_CONFIG_TOKEN } from '../../../../../environments/environments.token';

@Component({
  selector: 'blog-app-article-form',
  standalone: true,
  imports: [
    Button,
    FormField,
    ReactiveFormsModule,
    SearchSelectImages,
    SearchSelectWithCreate,
    UpdateCategoryModal,
    DragAndDropImageField,
  ],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
  providers: [
    CategoriesApi,
    CategoriesStoreService,
    CategoriesRepository,
    CategoriesHttpRepository,
    {
      provide: CATEGORIES_REPOSITORY_TOKEN,
      useFactory: (env: IENVconfig) => {
        return env.useLocalStorageService ? inject(CategoriesRepository) : inject(CategoriesHttpRepository);
      },
      deps: [ENV_CONFIG_TOKEN],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormHandlerService);
  private readonly categoriesStore = inject(CategoriesStoreService);
  private readonly categoriesService = inject(CATEGORIES_REPOSITORY_TOKEN);
  protected readonly useLocalStorage = inject(ENV_CONFIG_TOKEN).useLocalStorageService;

  private currentEditingId: string | undefined = undefined;
  protected readonly buttonVariant = ButtonVariant;
  protected readonly buttonType = ButtonType;
  protected readonly formFieldType = FormFieldType;
  protected readonly formTheme = FormTheme.Light;
  protected readonly buttonColor = ButtonColor;
  protected readonly optionsImage = signal(optionsImagesData);
  protected readonly isLoading = signal(false);
  protected readonly formVariant = signal(ArticleFormVariants.Add);
  protected readonly isFullyOpen = signal(false);
  protected readonly categories = computed<ISearchSelectWithCreateOptions[]>(() =>
    this.categoriesStore.categories().map((category) => ({
      id: category.id,
      label: category.name,
      value: category.name,
    })),
  );
  protected readonly isCategoriesLoading = this.categoriesStore.isLoading;
  protected readonly isAddNewCategoryLoading = this.categoriesStore.isAddNewCategoryLoading;
  protected readonly isUpdateCategoryLoading = this.categoriesStore.isUpdateCategoryLoading;
  protected readonly ArticleFormVariants = ArticleFormVariants;

  public readonly isOpen = signal(false);
  public readonly editArticleData = input<IArticle>();
  public readonly submitted = output<IAddArticleData & { id?: string }>();

  private readonly updateCategoryModal = viewChild.required(UpdateCategoryModal);

  protected readonly articleForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(25)]],
    content: ['', [Validators.required]],
    imgSrc: [''],
    image: [null as File | null],
    categoryId: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const data = this.editArticleData();

      if (data && this.formVariant() === ArticleFormVariants.Edit) {
        this.articleForm.patchValue({
          title: data.title,
          content: data.content,
          imgSrc: data.imgSrc,
          categoryId: data.categoryId,
          image: null,
        });
      } else if (this.formVariant() === ArticleFormVariants.Add) {
        this.articleForm.reset();
      }
    });
  }

  ngOnInit(): void {
    this.categoriesService.loadCategories();
    this.updateImageValidators();
  }

  protected readonly articleFormTitles: Record<ArticleFormVariants, string> = {
    [ArticleFormVariants.Add]: 'Добавить статью',
    [ArticleFormVariants.Edit]: 'Изменить статью',
  };
  protected readonly articleFormButtonSubmitTitles: Record<ArticleFormVariants, string> = {
    [ArticleFormVariants.Add]: 'Добавить',
    [ArticleFormVariants.Edit]: 'Сохранить',
  };

  private updateImageValidators(): void {
    const isEdit = this.formVariant() === ArticleFormVariants.Edit;
    const { imgSrc, image } = this.articleForm.controls;

    imgSrc.clearValidators();
    image.clearValidators();

    if (this.useLocalStorage) {
      imgSrc.setValidators(Validators.required);
    } else {
      if (!isEdit) {
        image.setValidators(Validators.required);
      }
    }

    imgSrc.updateValueAndValidity();
    image.updateValueAndValidity();
  }

  private scrollToForm(): void {
    setTimeout(() => {
      document.getElementById('add-article-anchor')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'grid-template-rows' && this.isOpen()) {
      this.isFullyOpen.set(true);
    }
  }

  protected onTransitionStart(event: TransitionEvent): void {
    if (event.propertyName === 'grid-template-rows' && !this.isOpen()) {
      this.isFullyOpen.set(false);
    }
  }

  protected openUpdateCategoryModal(categoryId: string): void {
    const category = this.categories().find((c) => c.id === categoryId);
    if (category) {
      this.updateCategoryModal()?.openUpdateCategoryModal(category.id, category.value);
    }
  }

  protected async updateCategory(newCategory: IUpdateCategoryModalForm): Promise<void> {
    await this.categoriesService.updateCategory(newCategory.newCategoryName, newCategory.categoryId);
  }

  protected deleteCategory(categoryId: string): void {
    this.categoriesService.deleteCategory(categoryId);
  }

  protected async onSubmit(): Promise<void> {
    const rawData = this.articleForm.getRawValue();
    const isEdit = this.formVariant() === ArticleFormVariants.Edit;
    const result = isEdit ? { ...rawData, id: this.editArticleData()?.id } : rawData;

    let categoryId: string = rawData.categoryId;
    if (!this.categoriesStore.categories().find((c) => c.id === categoryId)) {
      categoryId = await this.categoriesService.addCategory(rawData.categoryId);
    }

    await this.formService.processSubmit<IAddArticleData>(this.articleForm, this.isLoading, () => {
      this.submitted.emit({ ...result, categoryId } as IAddArticleData);
      this.onReset();
    });
  }

  protected onReset(): void {
    this.articleForm.reset();
    this.formVariant.set(ArticleFormVariants.Add);
    this.isOpen.set(false);
    this.updateImageValidators();
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

    this.updateImageValidators();

    this.isOpen.set(true);
    this.scrollToForm();
  }
}
