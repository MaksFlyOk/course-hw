import { Component, input, signal } from '@angular/core';

import { Modal } from '@components/modal/modal';

@Component({
  selector: 'blog-app-stat-modal',
  imports: [Modal],
  templateUrl: './stat-modal.html',
  styleUrl: './stat-modal.scss',
})
export class StatModal {
  protected readonly isStatModalOpen = signal(false);
  public readonly totalArticles = input.required<number>();
  public readonly totalComments = input.required<number>();

  public openStatModal(): void {
    this.isStatModalOpen.set(true);
  }

  protected closeStatModal(): void {
    this.isStatModalOpen.set(false);
  }
}
