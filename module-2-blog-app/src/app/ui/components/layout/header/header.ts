import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Link } from '@components/layout/header/link.type';
import { HeaderLinkTypes } from '@models/header-link.model';

@Component({
  selector: 'app-blog-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly links: Link[] = [
    { type: HeaderLinkTypes.Page, routerLink: '', ariaLabel: "Текущая страница 'Главная'", dataText: 'Главная' },
    { type: HeaderLinkTypes.Page, routerLink: 'blog', ariaLabel: "Перейти на страницу 'Блог'", dataText: 'Блог' },
    {
      type: HeaderLinkTypes.Anchor,
      fragment: 'contacts',
      ariaLabel: "Перейти к разделу 'Контакты'",
      dataText: 'Контакты',
    },
  ];
  protected readonly HeaderLinkTypes = HeaderLinkTypes;
}
