
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppPagesPageRoutingModule } from './app-pages-routing.module';

import { AppPagesPage } from './app-pages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppPagesPageRoutingModule
  ],
  declarations: [AppPagesPage]
})
export class AppPagesPageModule { }
