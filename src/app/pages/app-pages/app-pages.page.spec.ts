
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppPagesPage } from './app-pages.page';

describe('AppPagesPage', () => {
  let component: AppPagesPage;
  let fixture: ComponentFixture<AppPagesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AppPagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
