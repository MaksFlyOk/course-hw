import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackFrom } from './feedback-form';

describe('FeedbackFrom', () => {
  let component: FeedbackFrom;
  let fixture: ComponentFixture<FeedbackFrom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackFrom],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackFrom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
