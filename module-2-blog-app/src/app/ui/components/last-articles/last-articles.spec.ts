import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastArticles } from './last-articles';

describe('LastArticles', () => {
  let component: LastArticles;
  let fixture: ComponentFixture<LastArticles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastArticles],
    }).compileComponents();

    fixture = TestBed.createComponent(LastArticles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
