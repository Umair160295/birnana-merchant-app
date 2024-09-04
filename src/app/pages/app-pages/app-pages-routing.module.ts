
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppPagesPage } from './app-pages.page';

const routes: Routes = [
  {
    path: '',
    component: AppPagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPagesPageRoutingModule { }
