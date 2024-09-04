
import { Component, OnInit,ViewChild} from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NgOtpInputComponent } from  'ng-otp-input';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  id: any;
  to: any;
  otp: any;
  otpparam:any;
  deviceType: any;
  submitted = false;
  isLogin: boolean = false;
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput:NgOtpInputComponent;
  constructor(
    private navParam: NavParams,
    private modalCtrl: ModalController,
    public util: UtilService,
    public api: ApiService
  ) {
    this.id = this.navParam.get('id');
    this.to = this.navParam.get('to');
    this.deviceType = this.navParam.get('deviceType');
    this.otpparam = this.navParam.get('otp');
    if(this.deviceType == 'mobile'){
      setTimeout(() => {
        this.ngOtpInput.setValue(this.otpparam);
        this.otp = this.otpparam
      }, 500);

    }
  }

  ngOnInit() {
  }
  onOtpChange(event: any) {
    this.otp = event;
  }

  onSubmit() {
    if (this.otp == '' || !this.otp) {
      this.util.errorToast(this.util.translate('Please enter OTP'));
      return false;
    }
    this.submitted = false;
    this.isLogin = true;
    const param = {
      id: this.id,
      otp: this.otp
    };
    this.api.post_public('v1/otp/verifyOTP', param).then((data: any) => {
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data) {
        this.close(data, 'ok');
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    });
  }

  close(data: any, role: any) {
    this.modalCtrl.dismiss(data, role);
  }
}
