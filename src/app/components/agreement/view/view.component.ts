import { AlertService } from '../../../shared/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';
import { Page } from 'src/app/shared/view-models/page.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { AgreementViewModel } from '../agreement.model';
import { AgreementService } from '../agreement.service';


@Component( {
  selector: 'app-view',
  templateUrl: './view.component.html',
} )
export class ViewComponent implements OnInit {

  page: Page = new Page();
  item: AgreementViewModel = new AgreementViewModel();

  constructor(
    private activatedRoute: ActivatedRoute,
    private _agreementService: AgreementService ) { }

  ngOnInit() {
    this.page.columns = [
      { Name: "SubmissionDate", Title: "Submission date", Selectable: true, Sortable: true },
      { Name: "CompanyName", Title: "Company name", Selectable: true, Sortable: true },
      { Name: "CompanyCountry", Title: "Company country", Selectable: true, Sortable: true },
      { Name: "CompanyAddress", Title: "Company address", Selectable: true, Sortable: true }
    ];



    this.initializePage();
    // this.search();
  }

  initializePage() {
    this.activatedRoute.paramMap.subscribe( params => {
      if ( params.has( 'id' ) ) {
        this.item.RequestID = +params.get( 'id' );
      }
      // alert( "here" )
      this.page.isLoading = true;
      this._agreementService.getById( this.item.RequestID ).subscribe( response => {
        if ( response.Success ) {
          this.item = response.Data;
          this.page.isLoading = false;
          if ( this.item.StaffSignedAggrementFilePath == null )
            this.item.StaffSignedAggrementFilePath = "";
          if ( this.item.ConsumerSignedAggrementFilePath == null )
            this.item.ConsumerSignedAggrementFilePath = "";
        }
      }, null, () => {
        this.page.isPageLoaded = true;
      } );
    } );
  };

}

