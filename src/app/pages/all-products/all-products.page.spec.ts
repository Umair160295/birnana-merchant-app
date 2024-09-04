import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllProductsPage } from './all-products.page';

describe('AllProductsPage', () => {
  let component: AllProductsPage;
  let fixture: ComponentFixture<AllProductsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
