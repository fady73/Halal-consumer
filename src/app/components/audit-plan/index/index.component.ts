import { AuditPlanStatus } from './../audit-plan-status.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from 'src/app/shared/view-models/page.model';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, Form, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../request/request.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AuditPlanSearchViewModel } from '../audit-plan-search.model';
import { AuditPlanViewModel } from '../audit-plan.model';
import { AuditPlanService } from '../audit-plan.service';
import { RequestModificationCreateViewModel } from '../request-modification-create.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuditPlanCreateViewModel } from '../audit-plan-create.model';
import { SelectItem } from 'src/app/shared/view-models/select-view-model';
import { VisitCreateViewModel } from '../visit-create-model';
import { Patterns, TodayValidator } from './../../../shared/common/patterns';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { CRUDCreatePage } from 'src/app/shared/view-models/crud-create.model';

@Component( {
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
} )
export class IndexComponent implements OnInit {
  // page: Page = new Page();
  page: CRUDCreatePage = new CRUDCreatePage();

  modificationFrom: FormGroup;
  searchViewModel: AuditPlanSearchViewModel = new AuditPlanSearchViewModel();
  items: AuditPlanViewModel[] = [];
  selectedItem: AuditPlanViewModel = new AuditPlanViewModel();
  modalRef: BsModalRef;
  haveNCRFile: boolean = false;
  doc:string="";
  url: SafeResourceUrl;
  employees: SelectItem[] = [];
  leadAuditors: number[] = [];
  teamMembers: number[] = [];
  affairsExperts: number[] = [];
  visit: VisitCreateViewModel = new VisitCreateViewModel();
  haveCorrectivePalnFile: boolean = false;
  @ViewChild( 'approveTemplate', { static: false } ) approveTemplate: any;
  @ViewChild( 'requestTemplate', { static: false } ) requestTemplate: any;
  @ViewChild( 'pdf', { static: false } ) pdf: any;
  @ViewChild( 'file', { static: false } ) file: any;
  model: AuditPlanCreateViewModel = new AuditPlanCreateViewModel();
  selectedVersion:number;
  private confirmedBtn = false;
  private confirmBtn = true;

  private isDisable = false;


  constructor( private _formBuilder: FormBuilder,
    private requestService: RequestService,
    private crud: CrudService,
    private _companyService: CompanyService,
    public sanitizer:DomSanitizer,
    private _router: Router,

    private _auditPlanService: AuditPlanService ) { }

  ngOnInit() {
    this._auditPlanService.get().subscribe( response => {
      this.items = response.Data.Result;
      this.items.forEach(item => {
        if(item.AuditPlanPDFFilePath == null)
        item.AuditPlanPDFFilePath="";
        if(item.NCRFilePath == null)
        item.NCRFilePath="";
        if(item.CorrectivePlanFilePath == null)
        item.CorrectivePlanFilePath="";
      });
      if ( this.items.some( x => x.NCRFilePath.length > 0 ) ) {
        this.haveNCRFile = true;
      }
      if ( this.items.some( x => x.CorrectivePlanFilePath.length > 0 ) )
        this.haveCorrectivePalnFile = true;
    } );



  }


  toggel() {
    this.confirmBtn = false;
    this.confirmedBtn = true;

  }

  // isColumnSelected( column: string ): number {
  //   return ( column != this.page.orderBy ) ? 0 : ( this.page.isAscending ? 1 : 2 );
  // }

  showApproveConfirmation( selectedItem: AuditPlanViewModel ) {
    this.selectedItem = selectedItem;
    this.modalRef = this.crud.modalService.show( this.approveTemplate, { class: 'modal-md' } );
  }
  showRequestModification( selectedItem: AuditPlanViewModel ) {
    this.selectedItem = selectedItem;
    this.createRequestModificationFrom();
    this.modalRef = this.crud.modalService.show( this.requestTemplate, { class: 'modal-md' } );
  }
  showIndex( selectedItem: AuditPlanViewModel ) {
    this.selectedItem = selectedItem;
    // this.createRequestModificationFrom();
    // alert(this.selectedItem.)
    this._auditPlanService.getAllVersions(this.selectedItem.RequestID
      ).subscribe(data=>{
        this.selectedVersion=data.Data[data.Data.length-1].Version;
          // alert(JSON.stringify(data.Data[data.Data.length-1].Version))
          this._auditPlanService.getByRequestID(this.selectedItem.RequestID,this.selectedVersion).subscribe(data=>{
            this.model=data.Data
            console.log(this.model)
            this.model.LeadAuditors.forEach( emp => {
              this.leadAuditors.push( emp.EmployeeID );
            } );
            this.model.TeamMembers.forEach( emp => {
              this.teamMembers.push( emp.EmployeeID );
            } );
            
            this.model.AffairsExperts.forEach( emp => {
              this.affairsExperts.push( emp.EmployeeID );
            } );
            if ( this.model.Visits.length == 0 ) {
              let visit = new VisitCreateViewModel();
              visit.AuditPlanID = this.model.ID;
              // this.model.Visits.push(visit);
            }
            this.createForm();

          })
    });

    this.modalRef = this.crud.modalService.show( this.file, { class: 'modal-lg' } );
  }
  createForm(): void {
    this.page.form = this.crud.formBuilder.group( {
      // ApplicationTitle: [this.model.ApplicationTitle, [Validators.required, Validators.maxLength( 100 )]],
      ConsumerName: [this.model.ConsumerName, [Validators.required, Validators.maxLength( 100 )]],
      Address: [this.model.Address, [Validators.required, Validators.maxLength( 100 )]],
      VisitNumber: [this.model.VisitNumber, [Validators.required, Validators.min( 1 ), Validators.maxLength( 9 ), Validators.pattern( Patterns.OnlyNumbers )]],
      AuditDate: [moment( this.model.AuditDate ).format( 'MM-DD-YYYY' ), [TodayValidator]],
      // LeadAuditors: [this.model.LeadAuditors, [Validators.required]],
      AuditLanguage: [this.model.AuditLanguage, [Validators.required]],
      Standards: [this.model.Standards, [Validators.maxLength( 255 )]],
      Scope: [this.model.Scope, [Validators.maxLength( 255 )]],
      Objectives: [this.model.Objectives, [Validators.maxLength( 255 )]],
      AdditionalNote: [this.model.AdditionalNote, [Validators.maxLength( 255 )]],
    } )
  }
  approve() {
    this._auditPlanService.approved( this.selectedItem ).subscribe( response => {
      if ( response.Success ) {
        this.crud.alert.success( response.Message );
        this.selectedItem.Status = 2;//AuditPlanStatus.Confirmed;
      }
      this._router.navigateByUrl(`/request`);

    } );
  }
  createRequestModificationFrom() {
    this.modificationFrom = this._formBuilder.group( {
      ModificationReason: ['', [Validators.required, Validators.maxLength( 255 )]]
    } );
  }
  saveModification() {
    //alert("saveModification");
    //this.isDisable= true;
    let modificationRequest = new RequestModificationCreateViewModel();
    Object.assign( modificationRequest, this.modificationFrom.value );
    modificationRequest.AuditPlanID = this.selectedItem.ID;
    this._auditPlanService.saveModification( modificationRequest ).subscribe( response => {
      if ( response.Success ) {
        this.crud.alert.success( response.Message );
        this.selectedItem.Status = 1;
      }
      this._router.navigateByUrl(`/request`);

    } );

  }

  showpdf(selected:string ) {
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://docs.google.com/gview?url="+selected+"&embedded=true");      
    this.url=this.sanitizer.bypassSecurityTrustResourceUrl(selected);
    this.modalRef = this.crud.modalService.show( this.pdf, { class: 'modal-md' } );
  }

}
