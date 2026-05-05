import { Component, input } from '@angular/core';

import { ISideMenuButton } from '@models/side-menu-buttons.model';

@Component({
  selector: 'blog-app-side-menu',
  imports: [],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  public readonly sideMenuButtons = input.required<ISideMenuButton[]>();
}
