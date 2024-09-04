
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  dummy: any[] = [];
  reviews: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
  ) {
    this.getReviews();
  }

  ngOnInit() {
  }

  getReviews() {
    const param = {
      id: localStorage.getItem('uid'),
    };
    this.dummy = Array(10);
    this.api.post_private('v1/ratings/getWithStoreId', param).then((data: any) => {
      this.dummy = [];
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.reviews = data.data;
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

  back() {
    this.util.onBack();
  }

  getDate(date: any) {
    return moment(date).format('lll');
  }
}
