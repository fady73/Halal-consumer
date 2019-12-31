import { AuthGuard } from './../shared/services/auth-guard.service';
// import { ChangePasswordComponent } from './change-password/change-password.component';
import { WaitingAdminApprovalComponent } from './waiting-admin-approval/waiting-admin-approval.component';
import { VerificationComponent } from './verification/verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from '../shared/module/shared.module';
import { VerificationApprovalComponent } from './verification-approval/verification-approval.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MoveNextByMaxLengthDirective } from './verification/move-next-by-max-length.directive';
import { ValidateAccountComponent } from './validate-account/validate-account.component';
import {MatSelectModule} from '@angular/material/select';
import { IntlInputPhoneModule } from 'intl-input-phone';
import { NgxIntlTelInputModule } from 'projects/ngx-intl-tel-input/src/lib/ngx-intl-tel-input.module';


const routes: Route[] = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verification', component: VerificationComponent, canActivate: [AuthGuard] },
  // { path: 'verification', component: VerificationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'reset-password/:code', component: ResetPasswordComponent },
  { path: 'validate/:code', component: ValidateAccountComponent },
  { path: 'waiting-admin-approval', component: WaitingAdminApprovalComponent, canActivate: [AuthGuard] },
  { path: 'verification-approval', component: VerificationApprovalComponent, canActivate: [AuthGuard] },



];
@NgModule( {
  declarations: [SignInComponent
    , SignUpComponent
    , ForgotPasswordComponent
    , VerificationComponent, ResetPasswordComponent, ChangePasswordComponent,
    WaitingAdminApprovalComponent, VerificationApprovalComponent, MoveNextByMaxLengthDirective, ValidateAccountComponent
  ],
  imports: [
    IntlInputPhoneModule,
NgxIntlTelInputModule,
    CommonModule, RouterModule.forChild( routes ), SharedModule,MatSelectModule
  ]
} )
export class UserModule { }
