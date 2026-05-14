import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectImages } from './search-select-images';

describe('SearchSelectImages', () => {
  let component: SearchSelectImages;
  let fixture: ComponentFixture<SearchSelectImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectImages],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSelectImages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
