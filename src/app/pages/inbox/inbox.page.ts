
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;
  receiver_id: any;
  roomId: any;
  message: any;
  messageList: any;
  loaded: boolean;
  yourMessage: boolean;
  interval: any;
  uid: any;
  name: any = '';
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.loaded = false;
        this.receiver_id = data.id;
        this.uid = localStorage.getItem('uid')
        this.yourMessage = true;
        this.name = data.name;
        this.getChatRooms();
      }
    })
  }

  getChatRooms(event?: any) {
    const param = {
      uid: this.uid,
      participants: this.receiver_id
    };
    this.api.post_private('v1/chats/getChatRooms', param).then((data: any) => {
      console.log(data);
      if (event) {
        event.target.complete();
      }
      if (data && data.status && data.status == 200) {
        if (data && data.data && data.data.id) {
          this.roomId = data.data.id;
        } else if (data && data.data2 && data.data2.id) {
          this.roomId = data.data2.id;
        }

        this.loaded = true;
        this.getChatsList();
        this.interval = setInterval(() => {
          console.log('calling in interval');
          this.getChatsList();
        }, 12000);
      } else {
        this.createChatRooms();
      }
    }, error => {
      console.log('error', error);
      this.loaded = false;
      this.createChatRooms();
    }).catch(error => {
      this.loaded = false;
      this.createChatRooms();
      console.log('error', error);
    });
  }

  createChatRooms() {
    const param = {
      uid: this.uid,
      participants: this.receiver_id,
      status: 1
    };
    this.api.post_private('v1/chats/createChatRooms', param).then((data: any) => {
      console.log(data);
      this.loaded = true;

      if (data && data.status && data.status == 200 && data.data) {
        this.roomId = data.data.id;
        this.getChatsList();
        this.interval = setInterval(() => {
          console.log('calling in interval');
          this.getChatsList();
        }, 12000);
      }
    }, error => {
      console.log('error', error);
      this.loaded = true;
    }).catch(error => {
      this.loaded = true;
      console.log('error', error);
    });
  }


  getChatsList() {
    this.api.post_private('v1/chats/getById', { room_id: this.roomId }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data.length) {
        this.messageList = data.data;
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  ionViewDidLeave() {
    console.log('leaae');
    clearInterval(this.interval);
  }

  sendMessage() {
    console.log(this.message);
    if (!this.message || this.message == '') {
      return false;
    }
    const msg = this.message;
    this.message = '';
    const param = {
      room_id: this.roomId,
      uid: this.uid,
      from_id: this.uid,
      message: msg,
      message_type: 0,
      status: 1,
    };
    this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post_private('v1/chats/sendMessage', param).then((data: any) => {
      console.log(data);
      this.yourMessage = true;

      if (data && data.status == 200) {
        this.getChatsList();
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.yourMessage = true;
      this.util.apiErrorHandler(error);
    });
  }

  back() {
    this.navCtrl.back();
  }
}
