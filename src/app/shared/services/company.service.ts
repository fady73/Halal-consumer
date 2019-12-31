import { ConsumerCreateModel } from './../../user/sign-up/consumer-create-model';
import { ResetPasswordViewModel } from './../../user/reset-password/reset-password.model';
import { ForgotPasswordViewModel } from './../../user/forgot-password/forgot-password.model';
import { LoginViewModel } from './../../user/sign-in/login.model';
import { ApiService } from 'src/app/shared/services/api.service';
import { Injectable } from '@angular/core';
import { ChangePasswordViewModel } from 'src/app/user/change-password/change-password.model';

@Injectable( {
  providedIn: 'root'
} )
export class CompanyService {

  controller = "company";
  constructor( private _apiService: ApiService ) { }

  getLoggedCompany() {
    return this._apiService.get( `/${this.controller}/GetLoggedCompany` );
  }
  getCompanyUserName() {
    return this._apiService.get( `/${this.controller}/getCompanyUserName` );
  }

  getCompanyName() {
    return this._apiService.get( `/${this.controller}/getCompanyName` );
  }
  getLoggedConsumerCopmany() {
    return this._apiService.get( `/${this.controller}/GetLoggedConsumerCopmany` );
  }
  getTypes() {
    return this._apiService.get( `/${this.controller}/GetTypes` );
  }
  login( model: LoginViewModel ) {
    return this._apiService.post( `/${this.controller}/login`, model );
  }
  forgotPassword( model: ForgotPasswordViewModel ) {
    return this._apiService.post( `/${this.controller}/ForgotPassword`, model );
  }
  changePassword( model: ChangePasswordViewModel ) {
    return this._apiService.post( `/User/ChangePassword`, model );
  }
  resetPassword( model: ResetPasswordViewModel ) {
    return this._apiService.post( `/${this.controller}/ResetPassword`, model );
  }

  put( model: ConsumerCreateModel ) {
    return this._apiService.update( `/${this.controller}/Put`, model );
  }

}
