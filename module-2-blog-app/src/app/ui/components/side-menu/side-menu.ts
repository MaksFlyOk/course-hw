import { Component, input } from '@angular/core';

import { SideMenuButton } from '@models/side-menu-buttons';

@Component({
  selector: 'blog-app-side-menu',
  imports: [],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  public readonly sideMenuButtons = input.required<SideMenuButton[]>();
}
