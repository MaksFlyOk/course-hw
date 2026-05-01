import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatModal } from './stat-modal';

describe('StatModal', () => {
  let component: StatModal;
  let fixture: ComponentFixture<StatModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatModal],
    }).compileComponents();

    fixture = TestBed.createComponent(StatModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
