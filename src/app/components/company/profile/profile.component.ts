import { AttachmentService } from './../../../shared/services/attachment.service';
import { ConsumerCreateModel } from './../../../user/sign-up/consumer-create-model';
import { CompanyService } from 'src/app/shared/services/company.service';
import { UserService } from './../../../user/user.service';
import { SelectItem } from './../../../shared/view-models/select-view-model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { forkJoin } from 'rxjs';
import { CountryService } from 'src/app/shared/services/country.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ProfilePictureViewModel } from './change-profile-picture';
import { NumberResult, ConfigurationOptions, OutputOptionsEnum, CustomCountryModel } from 'intl-input-phone';
import { SearchCountryField } from 'projects/ngx-intl-tel-input/src/lib/enums/search-country-field.enum';
import { TooltipLabel } from 'projects/ngx-intl-tel-input/src/lib/enums/tooltip-label.enum';
import { CountryISO } from 'projects/ngx-intl-tel-input/src/lib/enums/country-iso.enum';


@Component( {
  selector: 'app-profile',
  templateUrl: './profile.component.html',
} )
export class ProfileComponent implements OnInit {

  form: FormGroup;
  phoneForm:FormGroup;
  profileImage:string="";
  isPageLoaded = false;
  isUploaded = false;
  isSaving = false;
  model = new ConsumerCreateModel();
  types: SelectItem[] = [];
  countries: SelectItem[] = [];
  customCountryList1: CustomCountryModel[] = [];
  countriesWithout: SelectItem[] = [];

  countryID : number;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;

  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;
  IsRequired: boolean=true;
  constructor( private _formBuilder: FormBuilder
    , private _userService: UserService
    , private _alertService: AlertService
    , private _countryService: CountryService
    , private _companyService: CompanyService
    , private _attachmentService: AttachmentService
    , private _router: Router,
    private _crudService: CrudService,
  ) {
    this.configOption1 = new ConfigurationOptions();
    this.configOption1.SelectorClass = "InputValidation1";
    this.configOption1.OutputFormat = OutputOptionsEnum.Number;

  }
  OutputValue : NumberResult = new NumberResult();
  configOption1: ConfigurationOptions;

  ngOnInit() {
    this.initializePage();

  }
  initializePage() {
    forkJoin( [
      this._companyService.getLoggedConsumerCopmany(),
      this._companyService.getTypes(),
      this._countryService.getList(),
      this._userService.getProfilePicture()
    ] ).subscribe( response => {
      this.model = response[0].Data;
      this.types = response[1].Data;
      this.countries = response[2].Data;
      if ( this.types && this.types.length > 0 ) {
        this.model.Type = this.types[0].ID;
      }
      if ( this.countries && this.countries.length > 0 ) {
        this.model.CountryID = this.countries[0].ID;
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
      
      this.model.ImagePath = response[3].Data;
      this.isPageLoaded = true;
      this.createForm();
    } );
  }
  onNumberChage(outputResult)
  {
    this.OutputValue = outputResult;
    this.form.value.Phone=this.OutputValue.Number;
  }
  check(){
    if(this.form.value.LastName){
      this.requiredFlagChange(true)
    }
  }
  requiredFlagChange(isRequire: boolean) {
    this.IsRequired = isRequire;
  }
  createForm() {
   
  
    this.form = this._formBuilder.group( {
      FirstName: [this.model.FirstName, [Validators.required, Validators.maxLength( 50 )]],
      LastName: [this.model.LastName, [Validators.required, Validators.maxLength( 50 )]],
      Phone: [this.model.Phone, [Validators.required, Validators.pattern( Patterns.OnlyNumbers ), Validators.pattern( Patterns.PhoneMobile )]],
      Email: [this.model.Email, [Validators.required, Validators.pattern( Patterns.Email )]],
      Type: [this.model.Type, [Validators.required]],
      Name: [this.model.CompanyName, [Validators.required, Validators.maxLength( 50 )]],
      Address: [this.model.Address, [Validators.required, Validators.maxLength( 50 )]],
      CountryID: [this.model.CountryID, [Validators.required]],
    }
    );

  }
  save() {
    this.isSaving = true;
    let company = new ConsumerCreateModel();
    Object.assign( company, this.form.value );
    company.ID = this.model.ID;
    this._companyService.put( company ).subscribe( response => {
      if ( response.Success ) {
        this._alertService.success( response.Message )
      }
     
      this.isSaving = false;
    }, error => {
      this._alertService.error( error.Message );

    }, () => {
      this.isSaving = false;
    } );
  }
  get controls() {
    return this.form.controls;
  }


  onFileChanged( event ) {
    this.isUploaded = false;
    let formData: FormData = new FormData();
    formData.append( 'uploadFile_' + 0, event.target.files[0], event.target.files[0].name );
    this._attachmentService.upload( formData ).subscribe( response => {
      if ( response.Success ) {
        this.reset();
        let file = response.Data[0];
        this.model.ImagePath = file.FilePath;
        let profile=new ProfilePictureViewModel();
        profile.Image=this.model.ImagePath;

        this._userService.changeProfilePicture(profile).subscribe(date=>{
        });
      }
    },
      error => {
        this._alertService.error( " Maximum file size is 2 MB" );
      }
      , () => { this.isUploaded = true; } );

  }

  reset() {
    this.myInputVariable.nativeElement.value = "";
  }

}
