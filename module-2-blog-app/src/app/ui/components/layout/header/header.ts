import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { HeaderAnchorLink, HeaderLinkTypes, HeaderPageLink } from '@models/header-link.model';

type Link = HeaderPageLink | HeaderAnchorLink;

@Component({
  selector: 'app-blog-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly links: Link[] = [
    { type: HeaderLinkTypes.Page, routerLink: '', ariaLabel: "Текущая страница 'Главная'", dataText: 'Главная' },
    { type: HeaderLinkTypes.Page, routerLink: 'blog', ariaLabel: 'string', dataText: 'string' },
    {
      type: HeaderLinkTypes.Anchor,
      fragment: 'contacts',
      ariaLabel: "Перейти к разделу 'Контакты'",
      dataText: 'Контакты',
    },
  ];
  protected readonly HeaderLinkTypes = HeaderLinkTypes;
}
