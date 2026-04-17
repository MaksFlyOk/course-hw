import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSection } from './table-section';

describe('TableSection', () => {
  let component: TableSection;
  let fixture: ComponentFixture<TableSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSection],
    }).compileComponents();

    fixture = TestBed.createComponent(TableSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
