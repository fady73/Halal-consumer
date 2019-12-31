import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { forkJoin } from 'rxjs';
import { CountryService } from 'src/app/shared/services/country.service';

@Component({
  templateUrl: './success.component.html',
})
export class SuccessComponent implements OnInit {

  form: FormGroup;
  isPageLoaded = false;
  isSaving: boolean = false;
  constructor(private _formBuilder: FormBuilder
    , private _alertService: AlertService
    , private _countryService: CountryService
  ) { }

  ngOnInit() {
    //this.initializePage();

  }
  initializePage() {
    this.isPageLoaded = true;
  }

}

