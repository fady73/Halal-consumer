import { TokenService } from './../../shared/services/token.service';
import { SelectItem } from './../../shared/view-models/select-view-model';
import { CompanyService } from './../../shared/services/company.service';
import { ConsumerCreateModel } from './consumer-create-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { MustMatch } from 'src/app/shared/common/validators/must-match.validator';
import { UserService } from '../user.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { forkJoin } from 'rxjs';
import { CountryService } from 'src/app/shared/services/country.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';
import { NumberResult, ConfigurationOptions, OutputOptionsEnum, CustomCountryModel, SortOrderEnum } from 'intl-input-phone';

import { SearchCountryField } from 'projects/ngx-intl-tel-input/src/lib/enums/search-country-field.enum';
import { TooltipLabel } from 'projects/ngx-intl-tel-input/src/lib/enums/tooltip-label.enum';
import { CountryISO } from 'projects/ngx-intl-tel-input/src/lib/enums/country-iso.enum';



@Component( {
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  // styleUrls: ['./sign-up.component.css']
} )
export class SignUpComponent implements OnInit {
  OutputValue: NumberResult = new NumberResult();
  configOption1: ConfigurationOptions;


  form: FormGroup;
  isPageLoaded = false;
  model = new ConsumerCreateModel();
  isSaving = false;
  types: SelectItem[] = [];
  countries: SelectItem[] = [];
  countriesWithout: SelectItem[] = [];

  IsRequired: boolean;
  customCountryList1: CustomCountryModel[] = [];
  countryID : number;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  hiden=true;
  Type: number = 0;
	CountryISO = CountryISO;


  constructor( private _formBuilder: FormBuilder
    ,          private _userService: UserService
    ,          private _alertService: AlertService
    ,          private _countryService: CountryService
    ,          private _companyService: CompanyService
    ,          private _router: Router,
               private _crudService: CrudService,
  ) {
    this.configOption1 = new ConfigurationOptions();
    this.configOption1.SelectorClass = 'InputValidation1';
    this.configOption1.OutputFormat = OutputOptionsEnum.Number;
    if (localStorage.getItem("token")) {
      this._router.navigateByUrl( '/request' );
    }
    if (!localStorage.getItem("token")) {
      this._router.navigateByUrl( '/user/sign-up' );

    }

  }

  ngOnInit() {
    
    this.initializePage();

  }
  initializePage() {
    forkJoin( [
      this._companyService.getTypes(),
      this._countryService.getList()
    ] ).subscribe( response => {
      this.types = response[0].Data;
      this.countries = response[1].Data;
      if ( this.types && this.types.length > 0 ) {
        this.model.Type = this.types[0].ID;
      }
      if ( this.countries && this.countries.length > 0 ) {
        this.model.CountryID = this.countries[0].ID;
      }
      
      this.countries.forEach(e => {
       if(e.Name=="المملكة العربية السعودية")
        {
          this.countryID=e.ID;
        }
        else{
          this.countriesWithout.push(e);
        }
      });
      
      this.isPageLoaded = true;
      this.createForm();
    } );
  }
  RemoveCountry(){
     this.Type = this.form.value.Type;
    if( this.Type === 1)
    {
      const index = this.countries.findIndex(countries => countries.ID == this.countryID);
      this.countries.splice(index, 1);

    }
  }
  TrackCountry(index,item){
    if(!item) return null;
    
  }
  onNumberChage(outputResult) {
    this.OutputValue = outputResult;
  }
  requiredFlagChange(isRequire: boolean) {
    this.IsRequired = isRequire;
  }
  createForm() {
    this.form = this._formBuilder.group( {
      FirstName: [null, [Validators.required, Validators.maxLength( 50 )]],
      LastName: [null, [Validators.required, Validators.maxLength( 50 )]],
      Phone: [null,[Validators.required, Validators.minLength(10), Validators.pattern( Patterns.OnlyNumbers )] ],
      Email: [null, [Validators.required, Validators.pattern( Patterns.Email )]],
      Type: [this.model.Type, [Validators.required]],
      Name: [null, [Validators.required, Validators.maxLength( 50 )]],
      Address: [null, [Validators.required, Validators.maxLength( 500 )]],
      CountryID: [this.model.CountryID, [Validators.required]],
      PostCode: [null, [Validators.required, Validators.pattern( Patterns.OnlyNumbers )]],
      Password: [null, [Validators.required, Validators.minLength( 8 )]],
      ConfirmPassword: [null, [Validators.required, Validators.minLength( 8 )]],

    }
      , {
        validator: MustMatch( 'Password', 'ConfirmPassword' )
      }
    );

  }
  save() {
    this.isSaving = true;
    const company = new ConsumerCreateModel();
    // this.form.value.Phone = this.OutputValue.Number;
    Object.assign( company, this.form.value );
    this._userService.signup( company ).subscribe( response => {
      if ( response.Success ) {
        this._alertService.success(response.Message);
        this._router.navigateByUrl( '/user/sign-in' );
      } else {
        this._alertService.error( response.Message );

      }
    }, error => {
    }, () => {
      this.isSaving = false;
    } );
  }
  get controls() {
    return this.form.controls;
  }
}
