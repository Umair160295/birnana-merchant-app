
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartDataPageRoutingModule } from './chart-data-routing.module';

import { ChartDataPage } from './chart-data.page';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartDataPageRoutingModule,
    NgChartsModule
  ],
  declarations: [ChartDataPage]
})
export class ChartDataPageModule { }
