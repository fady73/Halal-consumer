import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import {BsDropdownModule} from "ngx-bootstrap";
import { IntlInputPhoneModule } from 'intl-input-phone';
import { NgxIntlTelInputModule } from 'projects/ngx-intl-tel-input/src/lib/ngx-intl-tel-input.module';

const routes: Route[] = [
  { path: 'edit', component: ProfileComponent }
];
@NgModule( {
  declarations: [
    ProfileComponent,
  ],
  imports: [
    IntlInputPhoneModule,
    BsDropdownModule,
    NgxIntlTelInputModule,
    CommonModule, RouterModule.forChild( routes ), SharedModule, InternationalPhoneNumberModule
  ]
} )
export class CompanyModule { }
