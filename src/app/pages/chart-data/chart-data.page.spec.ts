
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartDataPage } from './chart-data.page';

describe('ChartDataPage', () => {
  let component: ChartDataPage;
  let fixture: ComponentFixture<ChartDataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChartDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
