
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  dummy = Array(20);
  dummyProducts: any[] = [];
  constructor(
    private navCtrl: NavController,
    private router: Router,
    public api: ApiService,
    public util: UtilService
  ) {
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  ngOnInit() {
  }

  getProducts() {
    const param = {
      id: localStorage.getItem('uid'),
      limit: 5000,
    };
    this.api.post_private('v1/products/getByStoreIdStoreAll', param).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status == 200) {
        this.products = data.data;
        this.dummyProducts = data.data;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
      this.dummy = [];
    });
  }

  back() {
    this.navCtrl.back();
  }


  onSearchChange(event: any) {
    console.log(event.detail.value);
    this.products = this.dummyProducts.filter((ele: any) => {
      return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
    });
  }

  viewProduct(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['tabs/tab3/product-details'], param);
  }
  allProducts() {
    this.router.navigate(['tabs/tab3/all-products']);
  }
  createNew() {
    console.log('createnew');
    this.router.navigate(['tabs/tab3/new-product']);
  }
}
