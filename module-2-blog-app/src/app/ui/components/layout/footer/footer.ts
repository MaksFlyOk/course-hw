import { Component } from '@angular/core';

import { FeedbackData } from '@components/layout/footer/feedback-from/feedback-data.type';
import { FeedbackFrom } from '@components/layout/footer/feedback-from/feedback-from';

@Component({
  selector: 'app-blog-footer',
  imports: [FeedbackFrom],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected submitFeedbackForm(data: FeedbackData): void {
    console.log('Feedback form submitted:', data);
  }
}
