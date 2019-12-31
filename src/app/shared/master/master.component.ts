import { Component, OnInit, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Patterns } from '../common/patterns';
import { MatStepper } from '@angular/material';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
})

export class MasterComponent implements OnInit {
  marked = false;
  theCheckbox = false;
  constructor(
    private _alertService: AlertService,
    private _formBuilder: FormBuilder,
  ) {
    this.data.push({ Type: 'SUV', Model: '500', Year: '2009', Make: 'Mahinda', Color: 'Red', PlateNumber: 'RJ-15', Stateed: 'Rajsthan' });

  }

  orderForm: FormGroup;
  items: FormArray;
  data: any = [];

  ngOnInit() {

  }

  createItem(): FormGroup {
    return this._formBuilder.group({
      Type: '', Model: '', Year: '', Make: '', Color: '', PlateNumber: '', Stateed: ''
    });
  }

  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  onSubmit() {
    this.items = this.orderForm.get('items') as FormArray;
  }

}
