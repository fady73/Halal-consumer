import { Patterns } from './../../shared/common/patterns';
import { ForgotPasswordViewModel } from './forgot-password.model';
import { TokenService } from './../../shared/services/token.service';
import { CompanyService } from './../../shared/services/company.service';
import { AlertService } from './../../shared/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  // styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  
  form:FormGroup;
  constructor(
    private _userService:UserService,
    private _tokenService:TokenService,
    private _companyService:CompanyService,
    private _formBuilder:FormBuilder,
    private _alertService:AlertService,
    private _router:Router

  ) { }

  ngOnInit() {
    this._tokenService.removeToken();
    this.form=this._formBuilder.group({
      Email:['',[Validators.required,Validators.minLength(6),Validators.maxLength(40),Validators.pattern(Patterns.Email)]],
    });
  }
  send(){
        let model=new ForgotPasswordViewModel();
        Object.assign(model,this.form.value);
        this._companyService.forgotPassword(model).subscribe(
          response=>{
            if(response.Success)
            {
              this._alertService.success(response.Message);
            }
            else{
                this._alertService.error(response.Message);
            }
          }
        );

  }
  get controls(){
    return this.form.controls;
  }

}
