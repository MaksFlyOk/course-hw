import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectWithCreate } from './search-select-with-create';

describe('SearchSelectWithCreate', () => {
  let component: SearchSelectWithCreate;
  let fixture: ComponentFixture<SearchSelectWithCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectWithCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSelectWithCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
