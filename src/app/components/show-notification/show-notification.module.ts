import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowNotificationComponent } from './show-notification/show-notification.component';

import { Route, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from 'src/app/shared/module/shared.module';

const routes:Route[]=[
  {path:'index',component:ShowNotificationComponent},
  {path:'',component:ShowNotificationComponent}
];
@NgModule({
  declarations: [ShowNotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    SharedModule
  ]
})
export class ShowNotificationModule { }
