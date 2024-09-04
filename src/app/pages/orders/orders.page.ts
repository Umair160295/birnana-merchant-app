
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  segment = 1;
  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy = Array(50);
  olders: any[] = [];
  limit: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private chMod: ChangeDetectorRef
  ) {

    this.limit = 1;
    this.dummy = Array(50);
    this.getOrders('', false);
    this.util.subscribeOrder().subscribe((data) => {
      this.limit = 1;
      this.dummy = Array(50);
      this.getOrders('', false);
    });
  }

  ngOnInit() {
  }

  onClick(val: any) {
    this.segment = val;
  }

  goToOrder(ids: any) {
    console.log(ids);
    const navData: NavigationExtras = {
      queryParams: {
        id: ids.id
      }
    };
    this.router.navigate(['/order-detail'], navData);
  }

  getOrders(event: any, haveRefresh: any) {
    const param = {
      id: localStorage.getItem('uid'),
      limit: this.limit * 50
    };

    this.api.post_private('v1/orders/getByStoreForApps', param).then((data: any) => {
      console.log('by store id', data);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      this.olders = [];
      if (data && data.status && data.status == 200 && data.data.length > 0) {
        data.data.forEach(async (element: any, index: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders = await element.orders.filter((x: any) => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter((x: any) => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach((order: any) => {
                  if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                    console.log('strings', element.id);
                    order.variations = JSON.parse(order.variations);
                    console.log(order['variant']);
                    if (order["variant"] == undefined) {
                      order['variant'] = 0;
                    }
                  }
                });

                const status = selected[0].status;
                element['storeStatus'] = status;
                if (status == 'created') {
                  this.newOrders.push(element);
                } else if (status == 'accepted' || status == 'picked' || status == 'ongoing') {
                  this.onGoingOrders.push(element);
                } else if (status == 'rejected' || status == 'cancelled' || status == 'delivered' || status == 'refund') {
                  this.olders.push(element);
                }
              }
            }
          }
        });
        console.log('rejected', this.olders);
        console.log('new ', this.newOrders);
        console.log('old ', this.oldOrders);
        if (haveRefresh) {
          this.chMod.detectChanges();
          event.target.complete();
        }
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }
  getProfilePic(item: any) {
    return item && item.cover ? item.cover : 'assets/imgs/user.jpg';
  }

  doRefresh(event: any) {
    console.log(event);
    this.limit = this.limit + 1;
    this.getOrders(event, true);
  }
}
