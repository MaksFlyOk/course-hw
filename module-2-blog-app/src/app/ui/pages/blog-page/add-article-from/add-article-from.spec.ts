import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleFrom } from './add-article-from';

describe('AddArticleFrom', () => {
  let component: AddArticleFrom;
  let fixture: ComponentFixture<AddArticleFrom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArticleFrom],
    }).compileComponents();

    fixture = TestBed.createComponent(AddArticleFrom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
