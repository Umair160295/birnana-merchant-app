
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-chart-data',
  templateUrl: './chart-data.page.html',
  styleUrls: ['./chart-data.page.scss'],
})
export class ChartDataPage implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabelsMonths: string[] = [];
  public barChartLabelsWeeks: string[] = [];
  public barChartLabelsToday: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartDataMonths: ChartDataset[] = [
    { data: [], label: 'Monthly' }
  ];
  public barChartDataWeeks: ChartDataset[] = [
    { data: [], label: 'Weekly' }
  ];
  public barChartDataToday: ChartDataset[] = [
    { data: [], label: 'Today' }
  ];
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: ChartDataset[] = [
    { data: [] }
  ];

  public doughnutChartType: ChartType = 'doughnut';

  public topProducts: any[] = [];
  monthLabel: any = '';
  constructor(
    public util: UtilService,
    private modalController: ModalController,
    private navParam: NavParams
  ) {
    const topProduct = this.navParam.get('topProducts');
    const monthsChartData = this.navParam.get('monthsChartData');
    const weeksChartData = this.navParam.get('weeksChartData');
    const todayChartData = this.navParam.get('todayChartData');
    this.monthLabel = this.navParam.get('monthLabel');
    console.log(topProduct);
    console.log(monthsChartData);
    console.log(weeksChartData);
    this.topProducts = topProduct;
    if (topProduct && topProduct.length) {
      topProduct.forEach((element: any) => {
        this.doughnutChartLabels.push(element.items.name);
        this.doughnutChartData[0].data.push(element.counts);
      });

    }

    if (monthsChartData && monthsChartData.length) {
      monthsChartData.forEach((element: any) => {
        this.barChartLabelsMonths.push(element.date);
        this.barChartDataMonths[0].data.push(element.totalSell);
      });
    }

    if (weeksChartData && weeksChartData.length) {
      weeksChartData.forEach((element: any) => {
        this.barChartLabelsWeeks.push(element.date);
        this.barChartDataWeeks[0].data.push(element.totalSell);
      });
    }

    if (todayChartData && todayChartData.length) {
      todayChartData.forEach((element: any) => {
        this.barChartLabelsToday.push(element.date);
        this.barChartDataToday[0].data.push(element.totalSell);
      });
    }
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }
}
