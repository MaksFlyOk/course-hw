import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[blogAppClickOutside]',
  standalone: true,
})
export class ClickOutside {
  private readonly elementRef = inject(ElementRef);

  public readonly blogAppClickOutside = output<void>();

  @HostListener('document:click', ['$event.target'])
  public onClick(target: EventTarget | null): void {
    if (!target || !(target instanceof Node)) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.blogAppClickOutside.emit();
    }
  }
}
