
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyResetPage } from './verify-reset.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyResetPageRoutingModule { }
