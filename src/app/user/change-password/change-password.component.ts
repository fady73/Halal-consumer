import { ActivateViewModel } from '../../shared/view-models/activate-view-model';
import { ChangePasswordViewModel } from './change-password.model';
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
  templateUrl: './change-password.component.html',
  // styleUrls: ['./forgot-password.component.css']
})
export class ChangePasswordComponent implements OnInit {


  form: FormGroup;
  constructor(
    private _userService: UserService,
    private _tokenService: TokenService,
    private _companyService: CompanyService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {


    this.form = this._formBuilder.group({
      CurrentPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
      NewPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],

    }
      // ,{
      //   validator: MustMatch('Password', 'ConfirmPassword')
      // }
    );
  }
  send() {
    let model = new ChangePasswordViewModel();
    Object.assign(model, this.form.value);
    this._companyService.changePassword(model).subscribe(
      response => {
        if (response.Success) {
          //this._userService.logout();
          this._router.navigateByUrl("/user/sign-in");
          this._alertService.success(response.Message);
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
