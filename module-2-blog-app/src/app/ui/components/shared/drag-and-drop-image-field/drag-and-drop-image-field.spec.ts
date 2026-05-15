import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropImageField } from './drag-and-drop-image-field';

describe('DragAndDropImageField', () => {
  let component: DragAndDropImageField;
  let fixture: ComponentFixture<DragAndDropImageField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropImageField],
    }).compileComponents();

    fixture = TestBed.createComponent(DragAndDropImageField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
