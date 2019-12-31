import { Page } from './../../../shared/view-models/page.model';
import { AuditPlanViewModel } from './../audit-plan.model';
import { AttachmentCreateViewModel } from './../../../shared/view-models/attachment-create.model';
import { UploadFile } from './../../../shared/view-models/upload-file';
import { AttachmentService } from './../../../shared/services/attachment.service';
import { CrudService } from './../../../shared/services/crud.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NcrService } from '../ncr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditPlanService } from '../audit-plan.service';
import { NCRViewModel } from '../ncr/ncr.model';
import { NCSAcceptingSuppliedDocumentViewModel } from '../ncr/ncs-accepting-supplied-document-create';

@Component( {
  selector: 'app-accepting-supplied-document',
  templateUrl: './accepting-supplied-document.component.html',
  styleUrls: ['./accepting-supplied-document.component.css']
} )
export class AcceptingSuppliedDocumentComponent implements OnInit {
  page: Page = new Page();
  model: NCRViewModel = new NCRViewModel();
  auditPlan: AuditPlanViewModel = new AuditPlanViewModel();
  isUploading = false;
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;

  constructor(
    private _NcrService: NcrService,
    private _auditPlanService: AuditPlanService,
    private _crudService: CrudService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe( params => {
      this.model.RequestID = +params.get( 'id' );
      this.getByRequestID( this.model.RequestID );
    } );
  }

  getAuditPlan( id: number ) {
    this._auditPlanService.getById( id ).subscribe( resposne => {
      this.auditPlan = resposne.Data;
    } );
  }
  getByRequestID( id: number ) {
    this._NcrService.getByRequestID( this.model.RequestID ).subscribe( response => {
      this.model = response.Data;
      this.model.NCSs.forEach( item => {
        item.CABAcceptance = false;
        item.SuppliedDocuments = [];
      } );
      this.page.isPageLoaded = true;
    } );
  }
  onFileChanged( event, NCS ) {
    this.isUploading = true;
    let isAllawableExt = true;
    let isBiggerThan5MB = false;
    let fileList: FileList = event.target.files;
    if ( fileList.length > 0 ) {
      let formData: FormData = new FormData();
      for ( let index = 0; index < fileList.length; index++ ) {
        let file: File = fileList[index];

        var ext = file.name.split( '.' )[1];
        if ( ext != "pdf" && ext != "docx" && ext != "doc" ) {
          isAllawableExt = false;
        }
        else if ( ( file.size / 1024 / 1024 ) > 5 ) {
          isBiggerThan5MB = true;
        }
        else {
          formData.append( 'uploadFile_' + index, file, file.name );
        }
      }
      if ( isAllawableExt == false ) {
        this._crudService.alert.error( "Only allawable files are pdf , doc , docx" );
        this.myInputVariable.nativeElement.value = "";
      }
      else if ( isBiggerThan5MB == true ) {
        this._crudService.alert.error( "Maximum file size is 5 MB" );
        this.myInputVariable.nativeElement.value = "";
        // this.dropzone.reset();
      }
      else {
        this._attachmentService.upload( formData ).subscribe( response => {
          if ( response.Success ) {
            let files: UploadFile[] = response.Data;
            for ( let index = 0; index < files.length; index++ ) {
              let item = files[index];
              let attachment = new AttachmentCreateViewModel();
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              let i = this.model.NCSs.indexOf( NCS );
              if ( !this.model.NCSs[i].SuppliedDocuments )
                this.model.NCSs[i].SuppliedDocuments = [];
              this.model.NCSs[i].SuppliedDocuments.push( attachment );
              this.isUploading = false;
            }
            this.myInputVariable.nativeElement.value = "";
          }
        }, null, () => { this.isUploading = false; } );
      }
    }

    else {
      this.isUploading = false;
    }

  }

  removeAttachment( item, index: number ) {
    let i = this.model.NCSs.indexOf( item );
    this.model.NCSs[i].SuppliedDocuments.splice( index, 1 );
  }

  save() {
    let ncs: NCSAcceptingSuppliedDocumentViewModel[] = [];
    this.model.NCSs.forEach( item => {
      ncs.push( { NCSID: item.ID, SuppliedDocuments: item.SuppliedDocuments } );
    } );
    this._NcrService.UploadSuppliedDocument( ncs ).subscribe( response => {
      if ( response.Success ) {
        this._crudService.alert.success( response.Message );
      }
      else {
        this._crudService.alert.error( response.Message );
      }
      this._router.navigateByUrl( `/request` );


    } );
  }
}
