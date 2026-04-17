import { Component, input, output } from '@angular/core';

import { ButtonColor, ButtonType, ButtonVariant } from './button.type';

@Component({
  selector: 'blog-app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  public readonly buttonText = input.required<string>();
  public readonly buttonType = input<ButtonType>(ButtonType.Button);
  public readonly disabled = input<boolean>(false);
  public readonly color = input<ButtonColor>(ButtonColor.Green);
  public readonly variant = input<ButtonVariant>(ButtonVariant.Filled);
  public readonly callback = output<MouseEvent>();

  protected onClick(event: MouseEvent): void {
    this.callback.emit(event);
  }
}
