
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  dummy: any[] = [];
  list: any[] = [];
  uid: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.uid = parseInt(localStorage.getItem('uid') ?? '');
    console.log(this.uid);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.list = [];
    this.getChatList();
  }

  getChatList() {
    this.dummy = Array(10);

    this.api.post_private('v1/chats/getChatListBUid', { id: this.uid }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.data && data.data.length) {
        this.list = data.data;
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

  onBack() {
    this.navCtrl.back();
  }

  openChat(id: any, type: any, userName: any) {
    console.log(id, type);
    const param: NavigationExtras = {
      queryParams: {
        id: id,
        name: userName + ' ' + "(" + this.util.translate(type) + ")"
      }
    };
    this.router.navigate(['inbox'], param);
  }
}
