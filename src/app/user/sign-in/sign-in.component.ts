import { AlertService } from './../../shared/alert/alert.service';
import { LoginViewModel } from './login.model';
import { Patterns } from './../../shared/common/patterns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from './../../shared/services/token.service';
import { CompanyService } from './../../shared/services/company.service';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyModel } from 'src/app/components/company/company.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  // styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  isPageLoaded = false;
  constructor(
    private _userService: UserService,
    private _tokenService: TokenService,
    private _companyService: CompanyService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _router: Router

  ) { 
    if (localStorage.getItem("token")) {
      this._router.navigateByUrl( '/request' );
    }
    if (!localStorage.getItem("token")) {
      this._router.navigateByUrl( '/user/sign-in' );

    }
  }
  company: CompanyModel;

  ngOnInit() {
    
    // this._tokenService.removeToken();
    this.form = this._formBuilder.group({
      Email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40), Validators.pattern(Patterns.Email)]],
      Password: ['', [Validators.required, Validators.maxLength(30)]],
      RememberMe: [true]
    });
    this.isPageLoaded = true;
  }
  login() {
    let model = new LoginViewModel();
    Object.assign(model, this.form.value);

    this._companyService.login(model).subscribe(
      response => {
        if (response.Success) {
          
          if (response.Data.NeedVerification == true) {
            //this._router.navigateByUrl("/user/verification");
            this._alertService.error(response.Message);
          }
          else {
            this._userService.login(response.Data.AccessToken);
            //this._router.navigateByUrl("/user/waiting-admin-approval");
            this.getCompanyDetails();
            this._router.navigateByUrl("/request");
          }

        }
        else {
          this._alertService.error(response.Message);
        }
      }
    );

  }
  get controls() {
    return this.form.controls;
  }
  getCompanyDetails() {
    this._companyService.getLoggedCompany().subscribe( response => {
      this.company = response.Data;
      localStorage.setItem("type", JSON.stringify(this.company.Type));

    } );
}

}
