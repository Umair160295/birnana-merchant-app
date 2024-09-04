
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  constructor(
    public util: UtilService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  editProfile() {
    this.util.navigateToPage('/edit-profile');
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/logout', {}).then((data: any) => {
      this.util.hide();
      console.log(data)
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.navigateRoot('/login');
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

  getProducts() {
    this.util.navigateToPage('/tabs/tab3/products');
  }

  getReviews() {
    this.util.navigateToPage('/reviews');
  }

  getLanguages() {
    this.util.navigateToPage('/languages');
  }

  changePassword() {
    this.util.navigateToPage('reset-password');
  }

  goToContact() {
    this.util.navigateToPage('tabs/tab3/contacts');
  }


  getName() {
    return this.util.store && this.util.store.name ? this.util.store.name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@app.com';
  }

  getCover() {
    return this.util.store && this.util.store.cover ? this.api.mediaURL + this.util.store.cover : 'assets/imgs/user.png';
  }

  goToAbout() {
    const param: NavigationExtras = {
      queryParams: {
        id: 1,
        name: 'About Us'
      }
    }
    this.util.navigateToPage('/tabs/tab3/app-pages', param);
  }

  goToChats() {
    this.util.navigateToPage('chats');
  }

  openMenu() {
    this.util.openMenu();
  }

  goFaqs() {
    const param: NavigationExtras = {
      queryParams: {
        id: 5,
        name: 'FAQs'
      }
    }
    this.util.navigateToPage('/tabs/tab3/app-pages', param);
  }

  goHelp() {
    const param: NavigationExtras = {
      queryParams: {
        id: 6,
        name: 'Help'
      }
    }
    this.util.navigateToPage('/tabs/tab3/app-pages', param);
  }
}
