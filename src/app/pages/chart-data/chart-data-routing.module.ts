
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartDataPage } from './chart-data.page';

const routes: Routes = [
  {
    path: '',
    component: ChartDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartDataPageRoutingModule { }
