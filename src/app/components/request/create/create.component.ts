import { Component, OnInit, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  form: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this._formBuilder.group({
      CompanyName: [null, [Validators.required,  Validators.maxLength(50)]],
      CompanyAddress: [null, [Validators.required,  Validators.maxLength(50)]],
      Phone: [null, []],
      Email: [null, [Validators.required,  Validators.maxLength(50), Validators.pattern(Patterns.Email)]],
      Address: [null, [ Validators.maxLength(50)]],
      AddressInvoic: [null, [ Validators.maxLength(50)]],
      TradeLicenseNumber: [null, [ Validators.maxLength(50)]],
      FoodSafetyManager: [null, [ Validators.maxLength(50)]],
      ManagmentRepresentative: [null, [ Validators.maxLength(50)]],
      Position: [null, [ Validators.maxLength(50)]],
      Postcode: [null, [ Validators.maxLength(50)]],
    });
  }

  save() {

  }



}
