import { Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { filter, map } from 'rxjs';

@Component({
  selector: 'app-blog-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);

  protected readonly currentPath: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
}
