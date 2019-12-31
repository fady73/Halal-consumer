import { SelectItem } from '../../shared/view-models/select-view-model';
import { CompanyService } from '../../shared/services/company.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { forkJoin } from 'rxjs';
import { CountryService } from 'src/app/shared/services/country.service';

@Component({
  templateUrl: './waiting-admin-approval.component.html',
})
export class WaitingAdminApprovalComponent implements OnInit {

  form:FormGroup;
  isPageLoaded=false;
  isSaving:boolean=false;
  types:SelectItem[]=[];
  countries:SelectItem[]=[];
  constructor(private _formBuilder:FormBuilder
    ,private _userService:UserService
    ,private _alertService:AlertService
    ,private _countryService:CountryService
    ,private _companyService:CompanyService
    ) { }

  ngOnInit() {
    //this.initializePage();
    
  }
  initializePage(){
    this.isPageLoaded=true;
    this.createForm();
  }
  createForm(){
this.form=this._formBuilder.group({
  Digit1:[null,[Validators.required,Validators.minLength(1),Validators.maxLength(1)]],
  Digit2:[null,[Validators.required,Validators.minLength(1),Validators.maxLength(1)]],
  Digit3:[null,[Validators.required,Validators.minLength(1),Validators.maxLength(1)]],
  Digit4:[null,[Validators.required,,Validators.minLength(1),Validators.maxLength(1)]],
}

);

  }
save()
{
  this.isSaving=true;
  let code=this.form.value.Digit1+this.form.value.Digit2+this.form.value.Digit3+this.form.value.Digit4;
  this._userService.validate(code).subscribe(response=>{
    if(response.Success)
    {
      this._alertService.success(response.Message);
    }
    else{
      this._alertService.error(response.Message);

    }
  },error=>{
  },()=>{
    this.isSaving=false;
  });
}
}
