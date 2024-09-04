
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import swal from 'sweetalert2';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  name: any = '';
  address: any = '';
  descritions: any = '';
  time: any = '';
  openTime: any = '';
  closeTime: any = '';
  latitude: any = '';
  longitude: any = '';
  id: any = '';
  coverImage: any = '';
  mobile: any;
  constructor(
    public util: UtilService,
    private navCtrl: NavController,
    public api: ApiService,
    private iab: InAppBrowser,
    private actionSheetController: ActionSheetController,
  ) {
    this.id = this.util.store.id;
    this.getVenue();
  }

  ngOnInit() {
  }

  getVenue() {
    const param = {
      id: this.id
    };
    this.util.show();
    this.api.post_private('v1/stores/getByIds', param).then((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status && datas.status == 200 && datas.data) {
        const info = datas.data;
        this.util.store = info;
        console.log('-------->', info);
        this.name = info.name;
        this.address = info.address;
        this.latitude = info.lat;
        this.longitude = info.lng;
        this.coverImage = info.cover;
        this.descritions = info.descriptions;
        this.openTime = info.open_time;
        this.closeTime = info.close_time;
        this.mobile = info.mobile;
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  openWeb() {
    this.iab.create('https://www.mapcoordinates.net/en', '_system');
  }

  update() {
    console.log(this.name, this.address, this.descritions, this.time,
      this.openTime, this.closeTime);
    if (this.name == '' || this.address == '' || this.latitude == '' || this.longitude == '' || this.descritions == '' || this.openTime == '' || this.closeTime == ''
      || !this.openTime || !this.closeTime) {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }


    if (!this.coverImage || this.coverImage == '') {
      this.util.errorToast(this.util.translate('Please add your cover image'));
      return false;
    }

    const param = {
      name: this.name,
      address: this.address,
      descriptions: this.descritions,
      lat: this.latitude,
      lng: this.longitude,
      cover: this.coverImage,
      open_time: this.openTime,
      close_time: this.closeTime,
      id: this.id,
    };

    this.util.show();
    this.api.post_private('v1/stores/updateDetails', param).then((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status == 200) {
        this.getVenue();
        this.navCtrl.back();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }

    }, error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  async updateProfile() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('camera clicked');
          this.upload(CameraSource.Camera);
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'images',
        handler: () => {
          console.log('gallery clicked');
          this.upload(CameraSource.Photos);
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  async upload(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        source,
        quality: 20,
        resultType: CameraResultType.Base64
      });
      console.log('image output', image);
      if (image && image.base64String) {
        const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
        this.util.show(this.util.translate('Uploading..'));
        this.api.uploadImage('v1/uploadImage', blobData, image.format).then((data) => {
          console.log('image upload', data);
          this.util.hide();
          if (data && data.status == 200 && data.success == true && data.data.image_name) {
            this.coverImage = data.data.image_name;
            console.log('this cover', this.coverImage);
            const param = {
              cover: this.coverImage,
              id: this.id,
            };

            this.util.show();
            this.api.post_private('v1/stores/updateDetails', param).then((datas: any) => {
              console.log(datas);
              this.util.hide();
              if (datas && datas.status == 200) {
                this.getVenue();
                this.navCtrl.back();
              } else {
                this.util.errorToast(this.util.translate('Something went wrong'));
              }

            }, error => {
              this.util.hide();
              console.log(error);
              this.util.apiErrorHandler(error);
            }).catch(error => {
              this.util.hide();
              console.log(error);
              this.util.apiErrorHandler(error);
            });
          } else {
            console.log('NO image selected');
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log('error', error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    } catch (error) {
      console.log(error);
      this.util.apiErrorHandler(error);
    }
  }

  b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  back() {
    this.navCtrl.back();
  }
  deleteAccount(){
    swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('You want to delete your account? Account once deleted cannot be used to login again!'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      cancelButtonText: this.util.translate('Cancel'),
      showCancelButton: true,
      backdrop: false,
      background: 'white'
    }).then((data:any)=>{

      if(data.isConfirmed){
        this.util.show(this.util.translate('deleting...'));
        const param = {
          id: localStorage.getItem('uid')
        };
        this.api.post_private('v1/profile/delete', param).then(info => {
          this.util.hide();
          localStorage.removeItem('uid');
          localStorage.removeItem('token');
          this.util.navigateRoot('/login');
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });   
      }
  
  }
    )
  }
}
