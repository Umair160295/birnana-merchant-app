
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyResetPage } from './verify-reset.page';

describe('VerifyResetPage', () => {
  let component: VerifyResetPage;
  let fixture: ComponentFixture<VerifyResetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerifyResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
