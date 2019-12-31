import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';

import { SharedModule } from 'src/app/shared/module/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { Payment1Component } from './payment-1/payment-1.component';
import { Payment2Component } from './payment-2/payment-2.component';
import { Payment3Component } from './payment-3/payment-3.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Payment4Component } from './payment4/payment4.component';
import { Payment5Component } from './payment-5/payment-5.component';
import { Payment6Component } from './payment-6/payment-6.component';
import { Payment7Component } from './payment-7/payment-7.component';
import { Payment8Component } from './payment-8/payment-8.component';
import { Paymentproduct7Component } from './paymentproduct7/paymentproduct7.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'payment-1/:id',
    component: Payment1Component
  },
  {
    path: 'payment-2/:id',
    component: Payment2Component
  },
  {
    path: 'payment-3/:id',
    component: Payment3Component
  },
  {
    path: 'payment-4/:id',
    component: Payment4Component
  }
  , {
    path: 'payment-5/:id',
    component: Payment5Component
  }
  , {
    path: 'payment-6/:id',
    component: Payment6Component
  }
  , {
    path: 'payment-7/:id',
    component: Payment7Component
  }, {
    path: 'payment-8/:id',
    component: Payment8Component
  }
  , {
    path: 'paymentproduct7/:id',
    component: Paymentproduct7Component
  }
];

@NgModule({
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
    NgxPaginationModule,
    NgbModule,
    NgSelectModule,
    CommonModule, RouterModule.forChild(routes),
    HttpClientModule
  ],
  declarations: [IndexComponent, Payment1Component, Payment2Component, Payment3Component, Payment4Component, Payment5Component, Payment6Component, Payment7Component, Payment8Component,Paymentproduct7Component]
})

export class PaymentModule { }
