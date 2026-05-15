import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, input, signal, viewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

import { FormTheme } from '@components/shared/form-field/form-field.type';

@Component({
  selector: 'blog-app-drag-and-drop-image-field',
  imports: [MatIcon],
  templateUrl: './drag-and-drop-image-field.html',
  styleUrl: './drag-and-drop-image-field.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DragAndDropImageField),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropImageField {
  protected readonly isDragging = signal(false);
  protected readonly preview = signal<string | null>(null);
  protected readonly fileName = signal<string | null>(null);
  protected readonly isDisabled = signal(false);
  public readonly id = input.required<string>();
  public readonly label = input.required<string>();
  public readonly control = input.required<FormControl>();
  public readonly placeholder = input<string>('Перетащите изображение или нажмите для выбора');
  public readonly theme = input<FormTheme>(FormTheme.Light);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  private onChange: (val: File | null) => void = () => {};

  private onTouched: () => void = () => {};

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.control().setErrors({ invalidFileType: true });
      return;
    }

    this.fileName.set(file.name);
    this.onChange(file);
    this.onTouched();

    const reader = new FileReader();

    reader.onload = (event) => this.preview.set(event.target?.result as string);
    reader.readAsDataURL(file);
  }

  protected getErrorMessage(): string {
    const control = this.control();

    if (control.errors?.['required']) {
      return 'Обязательное поле';
    }

    return 'Неверное значение';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDisabled()) {
      this.isDragging.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(false);

    if (this.isDisabled()) {
      return;
    }

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.processFile(file);
    }
  }

  protected openFilePicker(): void {
    if (!this.isDisabled()) {
      this.fileInput().nativeElement.click();
    }
  }

  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.processFile(file);
    }
  }

  protected clearFile(event: MouseEvent): void {
    event.stopPropagation();

    this.preview.set(null);
    this.fileName.set(null);

    this.fileInput().nativeElement.value = '';

    this.onChange(null);
    this.onTouched();
  }

  public writeValue(value: File | null): void {
    if (!value) {
      this.preview.set(null);
      this.fileName.set(null);
    }
  }

  public registerOnChange(fn: (val: File | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
