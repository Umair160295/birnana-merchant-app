
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ChartDataPage } from '../chart-data/chart-data.page';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  public selectedValue: any = 'today';
  public showGraph: any = 'today';
  public barChartOptions: ChartOptions = {
    responsive: true,
    backgroundColor: '#0081F7'
  };
  public barChartLabelsMonths: string[] = [];
  public barChartLabelsWeeks: string[] = [];
  public barChartLabelsToday: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public isShown = false;
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

  monthLabel: any = '';
  todayStates = {
    total: 0,
    totalSold: 0,
    totalItemsSold:0,
    label: ''
  }

  weeekStates = {
    label: '',
    total: 0,
    totalSold: 0,
    totalItemsSold:0,
  }

  monthStats = {
    label: '',
    total: 0,
    totalSold: 0,
    totalItemsSold:0,
  }

  todayStatesRejected = {
    total: 0,
    totalSold: 0,
  }

  weeekStatesRejected = {
    total: 0,
    totalSold: 0
  }

  monthStatsRejected = {
    total: 0,
    totalSold: 0
  }

  topProducts: any[] = [];
  monthsChartData: any[] = [];
  weeksChartData: any[] = [];
  todayChartData: any[] = [];
  complaints: any[] = [];
  reasons: any[] = [
    'The product arrived too late',
    'The product did not match the description',
    'The purchase was fraudulent',
    'The product was damaged or defective',
    'The merchant shipped the wrong item',
    'Wrong Item Size or Wrong Product Shipped',
    'Driver arrived too late',
    'Driver behavior',
    'Store Vendors behavior',
    'Issue with Payment Amout',
    'Others',
  ];

  issue_With: any[] = [
    '',
    'Order',
    'Store',
    'Driver',
    'Product'
  ];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private modalController: ModalController
  ) {
    this.getStasData();
  }

  ngOnInit() {
  }


  async openChart() {
    const modal = await this.modalController.create({
      component: ChartDataPage,
      componentProps: {
        topProducts: this.topProducts,
        monthLabel: this.monthStats.label,
        monthsChartData: this.monthsChartData,
        weeksChartData: this.weeksChartData,
        todayChartData: this.todayChartData
      }
    });

    await modal.present();

  }

  getStasData() {
    this.api.post_private('v1/orders/getStoreStatsData', { id: localStorage.getItem('uid') }).then((data: any) => {
      if (data && data.status && data.status == 200 && data.data) {
        const week = data.data.week.data;
        const month = data.data.month.data;
        const today = data.data.today.data;
        this.complaints = data.data.complaints;
        this.weeekStates.label = data.data.week.label;
        this.todayStates.label = data.data.today.label;
        this.monthStats.label = data.data.month.label;
        let weekDeliveredOrder: any[] = [];
        let weekDeliveredTotal: any = 0;
        let weekRejectedOrder: any[] = [];
        let weekRejectedTotal: any = 0;

        let monthDeliveredOrder: any[] = [];
        let monthDeliveredTotal: any = 0;
        let monthRejectOrder: any[] = [];
        let monthRejectedTotal: any = 0;

        let todayDeliveredOrder: any[] = [];
        let todayDeliveredTotal: any = 0;
        let todayRejectOrder: any[] = [];
        let todayRejectedTotal: any = 0;

        let allOrders: any[] = [];
        let todayOrder: any[] = [];
        let weekOrder: any[] = [];
        today.forEach(async (element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.orders = element.orders.filter((x: any) => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter((x: any) => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach((element: any) => {
                  allOrders.push(element);
                  todayOrder.push(element);
                });
                const status = selected[0].status;

                if (status == 'delivered') {
                  element.orders.forEach((order: any) => {
                    let price = 0;
                    if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                      order.variations = JSON.parse(order.variations);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    todayDeliveredTotal = todayDeliveredTotal + price;
                    todayDeliveredOrder.push(order);
                  });
                }
                if (status == 'rejected' || status == 'cancelled') {
                  element.orders.forEach((order: any) => {
                    let price = 0;
                    if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                      order.variations = JSON.parse(order.variations);
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    todayRejectedTotal = todayRejectedTotal + price;
                    todayRejectOrder.push(order);
                  });
                }
              }
            }
          }
        });

        const todaysDateChart = [...new Set(today.map((item: any) => moment(item.date_time).format('DD-MMM hh: a')))];
        let todaysDataChart: any[] = [];
        todaysDateChart.forEach(dt => {
          const item = {
            date: dt,
            sells: today.filter((x: any) => moment(x.date_time).format('DD-MMM hh: a') == dt),
            totalSell: 0
          }
          todaysDataChart.push(item)
        });
        todaysDataChart.forEach(data => {
          let orderTotal = 0;
          data.sells.forEach((element: any) => {
            element.orders.forEach((order: any) => {
              let price = 0;
              if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                order.variations = JSON.parse(order.variations);
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
              if (order && order.discount == 0) {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.original_price) * order.quantiy);
                }
              } else {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.sell_price) * order.quantiy);
                }
              }
              orderTotal = orderTotal + price;
            });
          });
          data.totalSell = orderTotal;
        });
        this.todayChartData = todaysDataChart;

        week.forEach(async (element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.orders = element.orders.filter((x: any) => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter((x: any) => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach((element: any) => {
                  allOrders.push(element);
                  weekOrder.push(element);
                });
                const status = selected[0].status;

                if (status == 'delivered') {
                  element.orders.forEach((order: any) => {
                    let price = 0;
                    if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                      order.variations = JSON.parse(order.variations);
                      
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    weekDeliveredTotal = weekDeliveredTotal + price;
                    weekDeliveredOrder.push(order);
                  });
                }
                if (status == 'rejected' || status == 'cancelled') {
                  element.orders.forEach((order: any) => {
                    let price = 0;
                    if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                      
                      order.variations = JSON.parse(order.variations);
                      
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    weekRejectedTotal = weekRejectedTotal + price;
                    weekRejectedOrder.push(order);
                  });
                }
              }
            }
          }
        });
        const weeksDateChart = [...new Set(week.map((item: any) => moment(item.date_time).format('DD MMM')))];
        let weeksDataChart: any[] = [];
        weeksDateChart.forEach(dt => {
          const item = {
            date: dt,
            sells: week.filter((x: any) => moment(x.date_time).format('DD MMM') == dt),
            totalSell: 0
          }
          weeksDataChart.push(item)
        });
        weeksDataChart.forEach(data => {
          let orderTotal = 0;
          data.sells.forEach((element: any) => {
            element.orders.forEach((order: any) => {
              let price = 0;
              if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                
                order.variations = JSON.parse(order.variations);
                
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
              if (order && order.discount == 0) {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.original_price) * order.quantiy);
                }
              } else {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.sell_price) * order.quantiy);
                }
              }
              orderTotal = orderTotal + price;
            });
          });
          data.totalSell = orderTotal;
          
        });

        this.weeksChartData = weeksDataChart;
        month.forEach(async (element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);

            element.orders = element.orders.filter((x: any) => x.store_id == localStorage.getItem('uid'));

            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter((x: any) => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach((element: any) => {
                  allOrders.push(element);
                });
                const status = selected[0].status;

                if (status == 'delivered') {
                  element.orders.forEach((order: any) => {
                    let price = 0;
                    if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                      
                      order.variations = JSON.parse(order.variations);
                      
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    monthDeliveredTotal = monthDeliveredTotal + price;
                    monthDeliveredOrder.push(order);
                  });
                }
                if (status == 'rejected' || status == 'cancelled') {
                  element.orders.forEach((order: any) => {
                    let price = 0;
                    if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                      
                      order.variations = JSON.parse(order.variations);
                      
                      if (order["variant"] == undefined) {
                        order['variant'] = 0;
                      }
                    }
                    if (order && order.discount == 0) {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.original_price) * order.quantiy);
                      }
                    } else {
                      if (order.size == 1) {
                        if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                          price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                        } else {
                          price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                        }
                      } else {
                        price = price + (parseFloat(order.sell_price) * order.quantiy);
                      }
                    }
                    monthRejectedTotal = monthRejectedTotal + price;
                    monthRejectOrder.push(order);
                  });
                }
              }
            }
          }
        });
        const monthsDateChart = [...new Set(month.map((item: any) => moment(item.date_time).format('DD MMM')))];
        let monthsDataChart: any[] = [];
        monthsDateChart.forEach(dt => {
          const item = {
            date: dt,
            sells: month.filter((x: any) => moment(x.date_time).format('DD MMM') == dt),
            totalSell: 0
          }
          monthsDataChart.push(item)
        });
        monthsDataChart.forEach(data => {
          let orderTotal = 0;
          data.sells.forEach((element: any) => {
            element.orders.forEach((order: any) => {
              let price = 0;
              if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                
                order.variations = JSON.parse(order.variations);
                
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
              if (order && order.discount == 0) {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.original_price) * order.quantiy);
                }
              } else {
                if (order.size == 1) {
                  if (order.variations[0].items[order.variant].discount && order.variations[0].items[order.variant].discount != 0) {
                    price = price + (parseFloat(order.variations[0].items[order.variant].discount) * order.quantiy);
                  } else {
                    price = price + (parseFloat(order.variations[0].items[order.variant].price) * order.quantiy);
                  }
                } else {
                  price = price + (parseFloat(order.sell_price) * order.quantiy);
                }
              }
              orderTotal = orderTotal + price;
            });
          });
          data.totalSell = orderTotal;
          
        });
        this.monthsChartData = monthsDataChart;

        this.weeekStates.total = weekDeliveredTotal;
        this.weeekStates.totalSold = weekDeliveredOrder.length;

        this.weeekStatesRejected.total = weekRejectedTotal;
        this.weeekStatesRejected.totalSold = weekRejectedOrder.length;

        this.monthStats.total = monthDeliveredTotal;
        this.monthStats.totalSold = monthDeliveredOrder.length;

        this.monthStatsRejected.total = monthRejectedTotal;
        this.monthStatsRejected.totalSold = monthRejectOrder.length

        const uniqueId = [...new Set(allOrders.map(item => item.id))];
        let topProducts: any[] = [];
        uniqueId.forEach(element => {
          const info = allOrders.filter(x => x.id == element);
          if (info && info.length > 0) {
            if (topProducts.length < 10) {
              const item = {
                id: element,
                items: info[0],
                counts: info.length
              };
              topProducts.push(item);
            }
          }
        });
        this.topProducts = topProducts.sort(({ counts: a }, { counts: b }) => b - a);
        const uniqueId1 = [...new Set(todayOrder.map(item => item.id))];
        let todayProducts: any[] = [];
        uniqueId1.forEach(element => {
          const info = todayOrder.filter(x => x.id == element);
          if (info && info.length > 0) {
              const item = {
                id: element,
                items: info[0],
                counts: info.length
              };
              todayProducts.push(item);
          }
        });
        const uniqueId2 = [...new Set(weekOrder.map(item => item.id))];
        let weekProducts: any[] = [];
        uniqueId2.forEach(element => {
          const info = weekOrder.filter(x => x.id == element);
            console.log(info);
          if (info && info.length > 0) {
              const item = {
                id: element,
                items: info[0],
                counts: info.length
              };
              console.log(item);
              weekProducts.push(item);
          }
        });
        this.todayStates.totalItemsSold = todayProducts.length;
        this.todayStates.total = todayDeliveredTotal;
        this.todayStates.totalSold = todayDeliveredOrder.length;

        this.todayStatesRejected.total = todayRejectedTotal;
        this.todayStatesRejected.totalSold = todayRejectOrder.length;

        this.weeekStates.totalItemsSold = weekProducts.length;
        this.monthStats.totalItemsSold = topProducts.length;
        this.isShown = true;
        if (this.monthsChartData && this.monthsChartData.length) {
          this.monthsChartData.forEach((element: any) => {
            this.barChartLabelsMonths.push(element.date);
            this.barChartDataMonths[0].data.push(element.totalSell);
          });
        }
    
        if (this.weeksChartData && this.weeksChartData.length) {
          this.weeksChartData.forEach((element: any) => {
            this.barChartLabelsWeeks.push(element.date);
            this.barChartDataWeeks[0].data.push(element.totalSell);
          });
        }
    
        if (this.todayChartData && this.todayChartData.length) {
          this.todayChartData.forEach((element: any) => {
            console.log(element.date);
            console.log(element.totalSell);
            this.barChartLabelsToday.push(element.date);
            this.barChartDataToday[0].data.push(element.totalSell);
          });
        }
      }
      
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }


  onStats() {
    this.util.navigateToPage('stats');
  }
  selectionChanged(event:any) {
    console.log(this.selectedValue,this.isShown);
    this.showGraph = this.selectedValue;
  }
}
