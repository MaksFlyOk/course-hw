import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

import { Button } from '@components/shared/button/button';
import { ButtonColor, ButtonVariant } from '@components/shared/button/button.type';

@Component({
  selector: 'blog-app-modal',
  imports: [Button],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogElement');
  protected readonly buttonVariant = ButtonVariant.Outlined;
  protected readonly buttonColor = ButtonColor.Red;
  public readonly title = input.required<string>();
  public readonly closed = output<void>();
  public isOpen = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.dialogRef().nativeElement.showModal();
      } else {
        this.dialogRef().nativeElement.close();
      }
    });
  }

  protected onClose(event?: Event): void {
    if (!event || event.target === this.dialogRef().nativeElement) {
      this.closed.emit();
    }
  }
}
