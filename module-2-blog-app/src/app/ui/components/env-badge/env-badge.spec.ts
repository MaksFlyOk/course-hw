import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvBadge } from './env-badge';

describe('EnvBadge', () => {
  let component: EnvBadge;
  let fixture: ComponentFixture<EnvBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
