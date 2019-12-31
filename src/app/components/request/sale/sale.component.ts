import { SelectItem } from './../../../shared/view-models/select-view-model';
import { RegularRequestService } from './../regular-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerViewModel } from './../../consumer/consumer-model';
import { AlertService } from './../../../shared/alert/alert.service';
import { CompanyService } from './../../../shared/services/company.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { SaleCreateViewModel } from './sale-create.model';
import { MarketingCountryViewModel } from './marketing-country.model';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
})

export class SaleComponent implements OnInit {
  form: FormGroup;
  model: SaleCreateViewModel = new SaleCreateViewModel();
  isPageLoaded = false;
  isUploading = false;
  isSaving = false;
  canEdit=false;
  cities = [];
  edit: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _regularRequestService: RegularRequestService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router

  ) { }

  ngOnInit() {
    this.initializePage();
  }


  initializePage() {
    this._activatedRoute.paramMap.subscribe(params => {
      this.model.RequestID = +params.get('id');

      forkJoin([
        this._requestService.getCountryList(),
        this._regularRequestService.getMarketingCountry(this.model.RequestID),
        this._requestService.getIsEditableSection(this.model.RequestID,5)

      ]).subscribe(res => {
        this.cities = res[0].Data.Result;
        this.canEdit=res[2].Data
        this.model.countriesIDs=[];
let selectedCountries=res[1].Data as MarketingCountryViewModel[];

selectedCountries.forEach(item=>{
  //alert(item.CountryID);
  this.model.countriesIDs.push(item.CountryID);
});
        this.createForm();
        this.isPageLoaded = true;
      });
    })
  }

  createForm() {
    this.form = this._formBuilder.group({
      countriesIDs: [this.model.countriesIDs, [Validators.required]],
    }
    );
  }

  resetForm() {
    this._router.navigateByUrl(`/request/operation/${this.model.RequestID}`)
  }

  save() {
    if(this.form.valid){
    this.isSaving = true;
    Object.assign(this.model, this.form.value);
    this._requestService.PostSales(this.model).subscribe(response => {
      this.isSaving = true;
      if (response.Success) {
        let requestID = response.Data as number;
        //this._alertService.success(response.Message);
        // this._router.navigateByUrl(`/request/visit-cost/${requestID}`)
        //this._router.navigateByUrl(`/request/visit-cost/${this.model.RequestID}`)
        this._requestService.getEditableSections(this.model.RequestID).subscribe(response=>{
          let sections=response.Data;
          this._requestService.navigateToNextEditableSection(this.model.RequestID,6,sections);
        });
      }
      else {
        this._alertService.error(response.Message);

      }
    }, () => {
      this.isSaving = false;
    });
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
