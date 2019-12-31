import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerViewModel } from './../../consumer/consumer-model';
import { AlertService } from './../../../shared/alert/alert.service';
import { CompanyService } from './../../../shared/services/company.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { RequestDetailsCreateViewModel } from '../request-details-create.model';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { Location } from '@angular/common';
@Component( {
  selector: 'app-create',
  templateUrl: './create-details.component.html',
} )

export class CreateDetailsComponent implements OnInit {
  form: FormGroup;
  model: RequestDetailsCreateViewModel = new RequestDetailsCreateViewModel();
  Consumer: ConsumerViewModel = new ConsumerViewModel();
  isPageLoaded = false;
  isSameAddressChecked = false;
  isPartGroup = false;
  canEdit = false;
  isSaving = false;
  renew: number = 0;
  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private location: Location


  ) { }

  ngOnInit() {
    this.initializePage();
    this.canEdit=false;
  }
  initializePage() {

    this._activatedRoute.paramMap.subscribe( params => {
      if ( params.has( 'id' ) ) {
        this.model.ID = +params.get( 'id' );
        // this.edit=true;
        //alert(this.model.ID);
      }

      forkJoin( [
        this._companyService.getLoggedConsumerCopmany(),
        this._requestService.getEditableByID( this.model.ID ),
        this._requestService.getIsEditableSection( this.model.ID, 1 )
        // this._requestService.getEditableSections(this.model.ID)

      ] ).subscribe( response => {
        this.Consumer = response[0].Data;

        this.model = response[1]["Data"];
        this.canEdit = response[2].Data;

        if ( this.model.ID == 0 )
          this.canEdit = true;
       
        let data: any = this.location.getState();
        this.isPartGroup=this.model.IsPartGroup;
        this.isSameAddressChecked=this.model.SameAddress;

        if ( data['type'] == 'renew' ) { this.renew = 1; this.canEdit = true; }
        this.createForm();
        this.isPageLoaded = true;
      } );
    } );
  }

  createForm() {
    this.form = this._formBuilder.group( {
      Name: [this.Consumer.CompanyName, [Validators.required, Validators.maxLength( 50 )]],
      CompanyAddress: [this.Consumer.Address, [Validators.required, Validators.maxLength( 50 )]],
      Phone: [this.Consumer.Phone, [Validators.required]],
      Email: [this.Consumer.Email, [Validators.required, Validators.maxLength( 50 ), Validators.pattern( Patterns.Email )]],
      Address: [this.Consumer.Address, [Validators.required, Validators.maxLength( 50 )]],
      InvoiceAddress: [this.model.InvoiceAddress, [Validators.required, Validators.maxLength( 50 )]],
      SameAddress: [this.model.SameAddress],
      TradeLicenseNumber: [this.model.TradeLicenseNumber, [Validators.required, Validators.maxLength( 100 )]],
      FoodSafetyManager: [this.model.FoodSafetyManager, [Validators.maxLength( 50 )]],
      ManagmentRepresentative: [this.model.ManagmentRepresentative, [Validators.required, Validators.maxLength( 50 )]],
      Position: [this.model.Position, [Validators.required, Validators.maxLength( 50 )]],
      PostalCode: [this.Consumer.PostalCode, [Validators.required, Validators.maxLength( 50 )]],
      GroupName: [this.model.GroupName, [Validators.maxLength( 50 )]],
      IsPartGroup: [this.model.IsPartGroup,],


    }
      //this.form.controls["Name"].disable()
    );
  }
  onSameAsAddressChecked() {
    this.isSameAddressChecked = !this.isSameAddressChecked;
    this.form.patchValue( {
      "InvoiceAddress": this.isSameAddressChecked ? this.Consumer.Address : ""
    } );
  }
  onPartOfGroupChecked() {
    this.isPartGroup = !this.isPartGroup;
    if ( !this.isPartGroup ) {
      this.form.patchValue( {
        "GroupName": ""
      } );
    }

  }
  resetForm() {
    this.isSameAddressChecked = false;
    this.isPartGroup = false;
    this.model = new RequestDetailsCreateViewModel();
    this.createForm();
    //  this.form.patchValue({
    //   InvoiceAddress:"",
    //   TradeLicenseNumber:"",
    //   FoodSafetyManager:"",
    //   ManagmentRepresentative:"",
    //   Position:"",
    //   GroupName:""

    //  });
  }
  save() {
    if(this.form.valid){
    this.isSaving = true;
    Object.assign( this.model, this.form.value );
    this.model.FoodSafetyManager = " ";
    this._requestService.post( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        //let requestID=response.Data as number;
        if ( this.model.ID == 0 )
          this.model.ID = response.Data as number;
        //this._alertService.success(response.Message);
        this._requestService.getEditableSections(this.model.ID).subscribe(response=>{
          let sections=response.Data;
          this._requestService.navigateToNextEditableSection(this.model.ID,1,sections);
        });
        //this._router.navigateByUrl( `/request/certification-required/${this.model.ID}` )

      }
      else {
        this._alertService.error( response.Message );

      }
    }, () => {
      this.isSaving = false;
    } );
  }
  else{
    this.validateAllFormFields(this.form); //{7}

  }

}
validateAllFormFields(formGroup: FormGroup) {         //{1}
  Object.keys(formGroup.controls).forEach(field => {  //{2}
    const control = formGroup.get(field);             //{3}
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        //{5}
      this.validateAllFormFields(control);            //{6}
    }
  });
}




}
