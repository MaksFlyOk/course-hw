import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import { IENVconfig } from '../../../../environments/environments.interface';
import { ENV_CONFIG_TOKEN } from '../../../../environments/environments.token';

@Component({
  selector: 'blog-app-env-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './env-badge.html',
  styleUrl: './env-badge.scss',
})
export class EnvBadge implements OnInit {
  protected readonly env = inject(ENV_CONFIG_TOKEN) as IENVconfig;

  protected readonly isVisible = signal(false);

  ngOnInit() {
    this.isVisible.set(true);
    setTimeout(() => this.isVisible.set(false), 4000);
  }
}
