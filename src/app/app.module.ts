
import { NgModule,ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { VerifyPageModule } from './pages/verify/verify.module';
import { VerifyResetPageModule } from './pages/verify-reset/verify-reset.module';
import { SelectCountryPageModule } from './pages/select-country/select-country.module';
import { SelectDriversPageModule } from './pages/select-drivers/select-drivers.module';
import { CategoryPageModule } from './pages/category/category.module';
import { SubCategoryPageModule } from './pages/sub-category/sub-category.module';
import { ChartDataPageModule } from './pages/chart-data/chart-data.module';
import { GlobalErrorHandlerService } from './core';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    VerifyPageModule,
    VerifyResetPageModule,
    SelectCountryPageModule,
    SelectDriversPageModule,
    CategoryPageModule,
    SubCategoryPageModule,
    ChartDataPageModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    InAppBrowser
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
