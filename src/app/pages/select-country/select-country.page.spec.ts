
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectCountryPage } from './select-country.page';

describe('SelectCountryPage', () => {
  let component: SelectCountryPage;
  let fixture: ComponentFixture<SelectCountryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectCountryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
