
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiErrorPage } from './api-error.page';

describe('ApiErrorPage', () => {
  let component: ApiErrorPage;
  let fixture: ComponentFixture<ApiErrorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApiErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
