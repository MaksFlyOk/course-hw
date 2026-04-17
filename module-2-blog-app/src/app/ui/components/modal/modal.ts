import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'blog-app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  public readonly title = input.required<string>();
  public isOpen = input<boolean>(false);
  public readonly closed = output<void>();
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialogElement');

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
