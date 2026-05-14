import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  computed,
  effect,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { FormTheme } from '@components/shared/form-field/form-field.type';
import { ISearchSelectWithCreateOptions } from '@components/shared/search-select-with-create/search-select-with-create.type';
import { Spinner } from '@components/shared/spinner/spinner';
import { ClickOutside } from '@directives/click-outside/click-outside';

@Component({
  selector: 'blog-app-search-select-with-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutside, Spinner, MatIcon, MatIconButton],
  templateUrl: './search-select-with-create.html',
  styleUrl: './search-select-with-create.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectWithCreate),
      multi: true,
    },
  ],
})
export class SearchSelectWithCreate implements ControlValueAccessor {
  private readonly dropdownList = viewChild.required<ElementRef<HTMLUListElement>>('dropdownList');
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  private readonly valueSignal = signal<string | null>(null);
  protected readonly focusedIndex = signal(-1);
  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);
  public readonly id = input.required<string>();
  public readonly label = input.required<string>();
  public readonly control = input.required<FormControl>();
  public readonly options = input.required<ISearchSelectWithCreateOptions[]>();
  public readonly placeholder = input.required<string>();
  public readonly loading = input<boolean>(false);
  public readonly loadingOption = input<boolean>(false);
  public readonly theme = input<FormTheme>(FormTheme.Light);
  public readonly edited = output<string>();
  public readonly deleted = output<string>();

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

      const found = options.find((option) => option.id === value);

      this.searchTerm.set(found ? found.label : value);
    });
  }

  protected commitValue(): void {
    const term = this.searchTerm().trim();

    if (!term) {
      this.updateValue(null, '');

      return;
    }

    const exactMatch = this.options().find((opt) => opt.label.toLowerCase() === term.toLowerCase());

    if (exactMatch) {
      this.updateValue(exactMatch.id, exactMatch.label);
    } else {
      this.updateValue(term, term);
    }

    this.isOpen.set(false);
  }

  private updateValue(id: string | null, label: string): void {
    this.valueSignal.set(id);
    this.searchTerm.set(label);
    this.onChange(id || '');
    this.onTouched();
  }

  private scrollToFocused(): void {
    setTimeout(() => {
      const listElement = this.dropdownList().nativeElement;
      const focusedElement = listElement?.children[this.focusedIndex()] as HTMLElement;

      focusedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  protected onFocus(): void {
    if (!this.disabled() && !this.loading()) {
      this.isOpen.set(true);
    }
  }

  protected onEditCategory(id: string, event: Event): void {
    event.stopPropagation();
    this.edited.emit(id);
  }

  protected onDeleteCategory(id: string, event: Event): void {
    event.stopPropagation();
    this.deleted.emit(id);
  }

  protected onClickOutside(): void {
    if (this.isOpen()) {
      this.commitValue();
      this.isOpen.set(false);
      this.focusedIndex.set(-1);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    const options = this.filteredOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.focusedIndex.set(Math.min(this.focusedIndex() + 1, options.length - 1));
          this.scrollToFocused();
        }

        break;
      case 'ArrowUp':
        event.preventDefault();

        this.focusedIndex.set(Math.max(this.focusedIndex() - 1, 0));
        this.scrollToFocused();

        break;
      case 'Enter':
        event.preventDefault();

        if (this.isOpen()) {
          if (this.focusedIndex() >= 0) {
            this.selectOption(options[this.focusedIndex()]);
          } else {
            this.commitValue();
          }
        }

        break;
      case 'Escape':
        event.preventDefault();

        this.isOpen.set(false);
        this.focusedIndex.set(-1);

        break;
      case 'Tab':
        if (this.isOpen()) {
          this.commitValue();
          this.isOpen.set(false);
        }

        break;
    }
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerm.set(value);
    this.isOpen.set(true);
    this.focusedIndex.set(-1);
  }

  protected toggleDropdown(): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.isOpen.update((v) => !v);

    if (this.isOpen()) {
      setTimeout(() => this.inputElement().nativeElement.focus());
    }
  }

  protected selectOption(option: ISearchSelectWithCreateOptions): void {
    this.updateValue(option.id, option.label);
    this.focusedIndex.set(-1);
    this.isOpen.set(false);
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

  protected getErrorsMessage(): string {
    const control = this.control();

    if (control.errors?.['required']) {
      return 'Обязательное поле';
    }

    return 'Неверное значение';
  }
}
