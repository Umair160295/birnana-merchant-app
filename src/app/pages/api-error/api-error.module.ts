
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApiErrorPageRoutingModule } from './api-error-routing.module';

import { ApiErrorPage } from './api-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApiErrorPageRoutingModule
  ],
  declarations: [ApiErrorPage]
})
export class ApiErrorPageModule { }
