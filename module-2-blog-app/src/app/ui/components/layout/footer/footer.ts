import { Component } from '@angular/core';

import { FeedbackData } from '@components/layout/footer/feedback-from/feedback-data.type';
import { FeedbackForm } from '@components/layout/footer/feedback-from/feedback-form';

@Component({
  selector: 'app-blog-footer',
  imports: [FeedbackForm],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected submitFeedbackForm(data: FeedbackData): void {
    // Заглушка для визуального отображения работы формы
    console.log('Feedback form submitted:', data);
  }
}
