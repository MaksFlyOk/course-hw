import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCategoryModal } from './update-category-modal';

describe('UpdateCategoryModal', () => {
  let component: UpdateCategoryModal;
  let fixture: ComponentFixture<UpdateCategoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCategoryModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCategoryModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
