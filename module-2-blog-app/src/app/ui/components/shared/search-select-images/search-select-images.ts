import { CommonModule } from '@angular/common';
import { Component, computed, effect, forwardRef, input, linkedSignal, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormTheme } from '@components/shared/form-field/form-field.type';
import { ISearchSelectImagesOptions } from '@components/shared/search-select-images/search-select-images.type';
import { ClickOutside } from '@directives/click-outside/click-outside';

@Component({
  selector: 'blog-app-search-select-images',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutside],
  templateUrl: './search-select-images.html',
  styleUrl: './search-select-images.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectImages),
      multi: true,
    },
  ],
})
export class SearchSelectImages implements ControlValueAccessor {
  public readonly id = input.required<string>();
  public readonly label = input.required<string>();
  public readonly control = input.required<FormControl>();
  public readonly options = input.required<ISearchSelectImagesOptions[]>();
  public readonly placeholder = input.required<string>();
  public readonly loading = input<boolean>(false);
  public readonly theme = input<FormTheme>(FormTheme.Light);
  private readonly valueSignal = signal<string | null>(null);
  protected readonly focusedIndex = signal(-1);
  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);
  protected readonly disabled = linkedSignal(this.loading);

  protected readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.options();
    return this.options().filter((opt) => opt.label.toLowerCase().includes(term));
  });

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const value = this.valueSignal();
      const options = this.options();

      if (!value) {
        this.searchTerm.set('');
        return;
      }

      const option = options.find((o) => o.imgSrc === value);

      this.searchTerm.set(option ? option.label : '');
    });
  }

  protected onClickOutside(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.focusedIndex.set(-1);
      this.onTouched();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const options = this.filteredOptions();

    if (this.disabled() || this.loading()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isOpen()) {
          this.isOpen.set(true);
        }

        this.focusedIndex.set(Math.min(this.focusedIndex() + 1, options.length - 1));
        this.scrollToFocused();

        break;
      case 'ArrowUp':
        event.preventDefault();

        this.focusedIndex.set(Math.max(this.focusedIndex() - 1, 0));
        this.scrollToFocused();

        break;
      case 'Enter':
        event.preventDefault();

        if (this.isOpen() && this.focusedIndex() >= 0) {
          this.selectOption(options[this.focusedIndex()]);
        }

        break;
      case 'Escape':
        this.isOpen.set(false);

        break;
      case 'Tab':
        this.isOpen.set(false);

        break;
    }
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerm.set(value);
    this.isOpen.set(true);

    if (!value.trim()) {
      this.onChange('');
      this.valueSignal.set(null);
    }
  }

  protected toggleDropdown(): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.isOpen.update((v) => !v);
  }

  protected selectOption(option: ISearchSelectImagesOptions): void {
    if (!option) {
      return;
    }

    this.valueSignal.set(option.imgSrc);
    this.isOpen.set(false);
    this.onChange(option.imgSrc);
    this.onTouched();
  }

  protected getErrorsMessage(): string {
    const control = this.control();

    if (control.errors?.['required']) {
      return 'Обязательное поле';
    }

    return 'Неверное значение';
  }

  private scrollToFocused(): void {
    const list = document.querySelector('.dropdown-list');
    const focused = list?.querySelectorAll('.option-item')[this.focusedIndex()];
    focused?.scrollIntoView({ block: 'nearest' });
  }

  public writeValue(value: string | null): void {
    this.valueSignal.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
