
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../analytics/analytics.module').then(m => m.AnalyticsPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () => import('../products/products.module').then(m => m.ProductsPageModule)
          },
          {
            path: 'new-product',
            loadChildren: () =>
              import('../new-product/new-product.module').then(m => m.NewProductPageModule)
          },
          {
            path: 'all-products',
            loadChildren: () =>
              import('../all-products/all-products.module').then(m => m.AllProductsPageModule)
          },
          {
            path: 'product-details',
            loadChildren: () =>
              import('../product-details/product-details.module').then(m => m.ProductDetailsPageModule)
          }
        ]
      },
      {
        path: 'tab4',
        loadChildren: () => import('../chats/chats.module').then(m => m.ChatsPageModule)
      },
      {
        path: 'tab5',
        children: [
          {
            path: '',
            loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
          },
          {
            path: 'about',
            loadChildren: () => import('../app-pages/app-pages.module').then(m => m.AppPagesPageModule)
          },
          {
            path: 'contacts',
            loadChildren: () =>
              import('../contacts/contacts.module').then(m => m.ContactsPageModule)
          },
          {
            path: 'products',
            loadChildren: () =>
              import('../products/products.module').then(m => m.ProductsPageModule)
          },

          {
            path: 'languages',
            loadChildren: () =>
              import('../languages/languages.module').then(m => m.LanguagesPageModule)
          },
          {
            path: 'app-pages',
            loadChildren: () =>
              import('../app-pages/app-pages.module').then(m => m.AppPagesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
