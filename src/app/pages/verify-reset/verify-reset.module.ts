
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyResetPageRoutingModule } from './verify-reset-routing.module';

import { VerifyResetPage } from './verify-reset.page';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyResetPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [VerifyResetPage]
})
export class VerifyResetPageModule { }
