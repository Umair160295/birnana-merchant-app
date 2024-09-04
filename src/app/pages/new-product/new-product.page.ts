
import { Component, OnInit,NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { CategoryPage } from '../category/category.page';
import { SubCategoryPage } from '../sub-category/sub-category.page';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage implements OnInit {
  isNew: boolean;
  cateId: any = '';
  cateName: any = '';

  subId: any = '';
  subName: any = '';

  name: any = '';
  realPrice: any = 0;
  sellPrice: any = 0;
  discount: any = 0;
  description: any;
  is_single: any;
  status: any = 1;
  coverImage: any = '';
  veg: boolean = true;

  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  image6: any;

  have_gram: boolean = false;
  gram: any = 0;
  have_kg: boolean = false;
  kg: any = 0;
  have_pcs: boolean = false;
  pcs: any = 0;
  have_liter: boolean = false;
  liter: any = 0;
  have_ml: boolean = false;
  ml: any = 0;
  barcode: any = '';
  exp_date: any;

  in_stoke: any = 1;
  in_offer: boolean = false;
  key_features: any = '';
  disclaimer: any = '';

  id: any;

  variations: any[] = [];
  size: boolean = false;
  public formGroup = new UntypedFormGroup({
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });
  public isSupported = false;
  public isPermissionGranted = false;
  public readonly barcodeFormat = BarcodeFormat;
  public barcodes: Barcode[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public util: UtilService,
    public api: ApiService,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    private readonly ngZone: NgZone
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log('=>', data);
      if (data && data.id) {
        this.isNew = false;
        this.id = data.id;
        this.getProduct();
      } else {
        this.isNew = true;
      }
      console.log(this.isNew);
    });
  }

  back() {
    this.navCtrl.back();
  }

  getProduct() {
    this.util.show();
    const param = {
      id: this.id
    };
    this.api.post_private('v1/products/getByIdStore', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        console.log('product ->', info);
        this.cateId = info.cate_id;
        this.subId = info.sub_cate_id;
        this.name = info.name;
        this.description = info.descriptions;
        this.coverImage = info.cover;
        this.key_features = info.key_features;
        this.disclaimer = info.disclaimer;
        this.discount = info.discount;
        this.exp_date = info.exp_date;
        this.gram = info.gram;
        this.have_gram = info.have_gram == 1 ? true : false;
        this.kg = info.kg;
        this.have_kg = info.have_kg == 1 ? true : false;
        this.liter = info.liter;
        this.have_liter = info.have_liter == 1 ? true : false;
        this.ml = info.ml;
        this.have_ml = info.have_ml == 1 ? true : false;
        this.pcs = info.pcs;
        this.have_pcs = info.have_pcs == 1 ? true : false;
        this.in_offer = info.in_offer == 1 ? true : false;
        this.in_stoke = info.in_stoke;
        this.is_single = info.is_single == 1 ? true : false;
        this.veg = info.kind == 1 ? true : false;
        this.realPrice = parseFloat(info.original_price);
        this.sellPrice = parseFloat(info.sell_price);
        this.status = info.status;
        this.size = info && info.size && info.size == 1 ? true : false;
        this.cateName = data.category.name;
        this.subName = data.subCategory.name;
        if (info && info.variations && info.variations != '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
            this.variations = JSON.parse(info.variations);
          }
        }
        if (info.images) {
          const images = JSON.parse(info.images);
          console.log('images==>>>', images);
          if (images[0]) {
            this.image1 = images[0];
          }
          if (images[1]) {
            this.image2 = images[1];
          }
          if (images[2]) {
            this.image3 = images[2];
          }
          if (images[3]) {
            this.image4 = images[3];
          }
          if (images[4]) {
            this.image5 = images[4];
          }
          if (images[5]) {
            this.image6 = images[5];
          }
        }


      }
    }, error => {
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
      console.log(error);
    });
  }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
    BarcodeScanner.removeAllListeners().then(() => {
      // BarcodeScanner.addListener(
      //   'googleBarcodeScannerModuleInstallProgress',
      //   (event) => {
      //     this.ngZone.run(() => {
      //       console.log('googleBarcodeScannerModuleInstallProgress', event);
      //       const { state, progress } = event;
      //       this.formGroup.patchValue({
      //         googleBarcodeScannerModuleInstallState: state,
      //         googleBarcodeScannerModuleInstallProgress: progress,
      //       });
      //     });
      //   },
      // );
    });
  }

  async openCate() {
    const modal = await this.modalCtrl.create({
      component: CategoryPage,
      componentProps: {
        id: this.cateId
      }
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data && data.role == 'selected') {
        this.cateId = data.data.id;
        this.cateName = data.data.name;
      }
    });
  }

  async openSub() {
    if (this.cateId && this.cateName) {
      const modal = await this.modalCtrl.create({
        component: SubCategoryPage,
        componentProps: {
          cateId: this.cateId,
          subId: this.subId
        }
      });
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data && data.data && data.role == 'selected') {
          this.subId = data.data.id;
          this.subName = data.data.name;
        }
      });
    } else {
      this.util.errorToast(this.util.translate('Please select category'));
    }
  }

  onDicount(input: any) {
    const value = parseFloat(input.detail.value);
    console.log(value);
    if (this.realPrice && value <= 99) {
      this.percentage(this.discount, this.realPrice);
    }
  }

  onRealPrice(input: any) {
    const value = parseFloat(input.detail.value);
    console.log(value);
    if (this.sellPrice && value > 1) {
      this.percentage(this.discount, this.realPrice);
    }
  }

  percentage(percent: any, total: any) {
    this.sellPrice = 0;
    const price = ((percent / 100) * total);
    this.sellPrice = this.realPrice - price;
  }

  create() {

    const image = [
      this.image1 ? this.image1 : '',
      this.image2 ? this.image2 : '',
      this.image3 ? this.image3 : '',
      this.image4 ? this.image4 : '',
      this.image5 ? this.image5 : '',
      this.image6 ? this.image6 : ''
    ];
    const param = {
      store_id: localStorage.getItem('uid'),
      cover: this.coverImage,
      name: this.name,
      images: JSON.stringify(image),
      original_price: this.realPrice,
      sell_price: this.sellPrice ? this.sellPrice : 0,
      discount: this.discount ? this.discount : 0,
      kind: this.veg ? 1 : 0,
      cate_id: this.cateId,
      sub_cate_id: this.subId,
      have_gram: this.have_gram ? 1 : 0,
      gram: this.have_gram ? this.gram : 0,
      have_kg: this.have_kg ? 1 : 0,
      kg: this.have_kg ? this.kg : 0,
      have_pcs: this.have_pcs ? 1 : 0,
      pcs: this.have_pcs ? this.pcs : 0,
      have_liter: this.have_liter ? 1 : 0,
      liter: this.have_liter ? this.liter : 0,
      have_ml: this.have_ml ? 1 : 0,
      ml: this.have_ml ? this.ml : 0,
      descriptions: this.description,
      exp_date: moment(this.exp_date).format('YYYY-MM-DD'),
      type_of: 1,
      in_stoke: this.in_stoke,
      status: this.status,
      in_offer: this.in_offer ? 1 : 0,
      key_features: this.key_features,
      disclaimer: this.disclaimer,
      is_single: this.is_single ? 1 : 0,
      in_home: 0,
      rating: 0,
      total_rating: 0,
      size: this.size == true ? 1 : 0,
      variations: JSON.stringify(this.variations)
    };

    console.log('*****', param);

    this.util.show();
    this.api.post_private('v1/products/saveProduct', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status == 200) {
        this.util.showToast(this.util.translate('Product added successfully'), 'success', 'bottom');
        this.navCtrl.back();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
      console.log('error', error);
    }).catch(error => {
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
      console.log('error', error);
    });
  }
  submit() {
    console.log('size-->>', this.size);
    console.log('submited', this.veg);
    if (!this.cateId || this.cateId == '') {
      this.util.errorToast(this.util.translate('Please select category'));
      return false;
    }
    if (!this.subId || this.subId == '') {
      this.util.errorToast(this.util.translate('Please select sub category'));
      return false;
    }
    if (!this.realPrice || this.realPrice == '') {
      this.util.errorToast(this.util.translate('Please enter product price'));
      return false;
    }
    if (!this.description || this.description == '') {
      this.util.errorToast(this.util.translate('Please enter product description'));
      return false;
    }
    if (!this.name || this.name == '') {
      this.util.errorToast(this.util.translate('Please enter product name'));
      return false;
    }
    if (!this.coverImage || this.coverImage == '') {
      this.util.errorToast(this.util.translate('Please add product image'));
      return false;
    }

    if (this.isNew) {
      console.log('new');
      this.create();
    } else {
      console.log('update');
      this.update();
    }
  }

  update() {

    const image = [
      this.image1 ? this.image1 : '',
      this.image2 ? this.image2 : '',
      this.image3 ? this.image3 : '',
      this.image4 ? this.image4 : '',
      this.image5 ? this.image5 : '',
      this.image6 ? this.image6 : ''
    ];
    const param = {
      id: this.id,
      store_id: localStorage.getItem('uid'),
      cover: this.coverImage,
      name: this.name,
      images: JSON.stringify(image),
      original_price: this.realPrice,
      sell_price: this.sellPrice ? this.sellPrice : 0,
      discount: this.discount ? this.discount : 0,
      kind: this.veg ? 1 : 0,
      cate_id: this.cateId,
      sub_cate_id: this.subId,
      have_gram: this.have_gram ? 1 : 0,
      gram: this.have_gram ? this.gram : 0,
      have_kg: this.have_kg ? 1 : 0,
      kg: this.have_kg ? this.kg : 0,
      have_pcs: this.have_pcs ? 1 : 0,
      pcs: this.have_pcs ? this.pcs : 0,
      have_liter: this.have_liter ? 1 : 0,
      liter: this.have_liter ? this.liter : 0,
      have_ml: this.have_ml ? 1 : 0,
      ml: this.have_ml ? this.ml : 0,
      descriptions: this.description,
      exp_date: moment(this.exp_date).format('YYYY-MM-DD'),
      type_of: 1,
      in_stoke: this.in_stoke,
      status: this.status,
      in_offer: this.in_offer ? 1 : 0,
      key_features: this.key_features,
      disclaimer: this.disclaimer,
      is_single: this.is_single ? 1 : 0,
      size: this.size == true ? 1 : 0,
      variations: JSON.stringify(this.variations)
    };

    console.log('*****', param);

    this.util.show();
    this.api.post_private('v1/products/updateProducts', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status == 200) {
        this.util.showToast(this.util.translate('Product updated successfully'), 'success', 'bottom');
        this.navCtrl.back();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
      console.log('error', error);
    }).catch(error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
      console.log('error', error);
    });
  }

  minStartDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  getMaxDate(): string {
    return moment().add('5', 'years').format('YYYY-MM-DD');
  }

  minEndDate(): string {
    return moment().add(1, 'day').format('YYYY-MM-DD');
  }
  async cover() {
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'md',
      buttons: [{
        text: this.util.translate('Camera'),
        role: 'camera',
        icon: 'camera',
        handler: () => {
          console.log('Camera clicked');
          this.upload(CameraSource.Camera);
        }
      },
      {
        text: this.util.translate('Gallery'),
        role: 'gallery',
        icon: 'image',
        handler: () => {
          console.log('Gallery clicked');
          this.upload(CameraSource.Photos);
        }
      }, {
        text: this.util.translate('Cancel'),
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
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


  async uploadExtra(source: CameraSource, num: any) {
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
            if (num == 1 || num == '1') {
              this.image1 = data.data.image_name;
            }
            if (num == 2 || num == '2') {
              this.image2 = data.data.image_name;
            }
            if (num == 3 || num == '3') {
              this.image3 = data.data.image_name;
            }
            if (num == 4 || num == '4') {
              this.image4 = data.data.image_name;
            }
            if (num == 5 || num == '5') {
              this.image5 = data.data.image_name;
            }
            if (num == 6 || num == '6') {
              this.image6 = data.data.image_name;
            }
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

  async others(num: any) {
    console.log('num', num);
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'md',
      buttons: [{
        text: this.util.translate('Camera'),
        role: 'camera',
        icon: 'camera',
        handler: () => {
          console.log('Camera clicked');
          this.uploadExtra(CameraSource.Camera, num);
        }
      },
      {
        text: this.util.translate('Gallery'),
        role: 'gallery',
        icon: 'image',
        handler: () => {
          console.log('Gallery clicked');
          this.uploadExtra(CameraSource.Photos, num);
        }
      }, {
        text: this.util.translate('Cancel'),
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  changeSize(event: any) {
    console.log(event);
    if (event && event.detail && event.detail.checked) {
      const items = this.variations.filter(x => x.title == 'size');
      console.log('length', items);
      if (!items.length) {
        const item = {
          title: 'size',
          type: 'radio',
          items: []
        };
        this.variations.push(item);
        console.log(this.variations);
      }
    } else {
      this.variations = this.variations.filter(x => x.title != 'size');
    }
  }

  async editTitle(index: any) {

    const alert = await this.alertController.create({
      header: this.util.translate('Edit title!'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.util.translate('Title'),
          value: this.variations[index].title
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.name) {
              this.variations[index].title = data.name;
            }
          }
        }
      ]
    });
    await alert.present();
  }


  async addItem(index: any) {
    console.log(this.variations[index]);
    const alert = await this.alertController.create({
      header: this.util.translate('Add item to') + ' ' + this.variations[index].title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.util.translate('Add-ons name')
        },
        {
          name: 'price',
          type: 'number',
          placeholder: this.util.translate('Add-ons price')
        },
        {
          name: 'discount',
          type: 'number',
          placeholder: this.util.translate('Add-ons discount')
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.translate('Ok'),
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.title && data.price) {
              const item = {
                title: data.title,
                price: parseFloat(data.price),
                discount: data && data.discount ? parseFloat(data.discount) : 0
              };
              this.variations[index].items.push(item);
              console.log(this.variations);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  delete(item: any) {
    console.log(item);
    if (item.title == 'size') {
      this.size = false;
    }

    this.variations = this.variations.filter(x => x.title != item.title);
  }



  deleteSub(index: any, item: any) {
    console.log(index);
    console.log(item);
    const selected = this.variations[index].items;
    console.log('selected', selected);
    const data = selected.filter((x: any) => x.title != item.title);
    console.log(data);
    this.variations[index].items = data;
    console.log('done', this.variations);
  }

  async editSub(index: any, items: any, subIndex: any) {
    console.log(index, items, subIndex);
    console.log(this.variations);
    console.log('update ir', this.variations[index].items[subIndex].discount);
    const alert = await this.alertController.create({
      header: this.util.translate('Edit item') + ' ' + this.variations[index].title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.util.translate('Variation name'),
          value: this.variations[index].items[subIndex].title
        },
        {
          name: 'price',
          type: 'number',
          placeholder: this.util.translate('Variation price'),
          value: this.variations[index].items[subIndex].price
        },
        {
          name: 'discount',
          type: 'number',
          placeholder: this.util.translate('Variation discount'),
          value: this.variations[index].items[subIndex].discount
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.translate('Ok'),
          handler: (data) => {
            console.log('data', data);
            console.log('Confirm Ok', this.variations[index].items[subIndex].discount);
            this.variations[index].items[subIndex].title = data.title;
            this.variations[index].items[subIndex].price = parseFloat(data.price);
            this.variations[index].items[subIndex].discount = data && data.discount ? parseFloat(data.discount) : 0;
            console.log(this.variations);
          }
        }
      ]
    });

    await alert.present();
  }
  public async scan(): Promise<void> {
    BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (data: any) => {
      if (!data.available) {
        this.installGoogleBarcodeScannerModule();
      }
      else {
        const formats: any = this.barcodeFormat.Aztec;
        const { barcodes } = await BarcodeScanner.scan({
          formats,
        });
        this.barcodes = barcodes;
      }
    })

  }
  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }
}
