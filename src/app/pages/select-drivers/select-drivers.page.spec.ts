
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDriversPage } from './select-drivers.page';

describe('SelectDriversPage', () => {
  let component: SelectDriversPage;
  let fixture: ComponentFixture<SelectDriversPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
