import { ActivateViewModel } from './../../shared/view-models/activate-view-model';
import { ResetPasswordViewModel } from './reset-password.model';
import { Patterns } from '../../shared/common/patterns';
import { TokenService } from '../../shared/services/token.service';
import { CompanyService } from '../../shared/services/company.service';
import { AlertService } from '../../shared/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/shared/common/validators/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  // styleUrls: ['./forgot-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  form: FormGroup;
  code: string;
  constructor(
    private _userService: UserService,
    private _tokenService: TokenService,
    private _companyService: CompanyService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router

  ) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(params => {
      this.code = params.get("code");
    });
    //this._tokenService.removeToken();
    this.form = this._formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
    });
  }
  send() {
    let model = new ResetPasswordViewModel();
    Object.assign(model, this.form.value);
    model.Code=this.code;
    this._companyService.resetPassword(model).subscribe(
      response => {
        if (response.Success) {
          this._alertService.success(response.Message);
       this._router.navigateByUrl("/user/sign-in");
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

}
