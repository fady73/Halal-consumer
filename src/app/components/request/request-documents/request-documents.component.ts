import { ReviewDocumentViewModel } from './../review-document-view.model';
import { AttachmentType } from './../../../shared/enum/attachment-type';
import { AttachmentCreateViewModel } from './../../../shared/view-models/attachment-create.model';
import { UploadFile } from './../../../shared/view-models/upload-file';
import { AttachmentService } from './../../../shared/services/attachment.service';
import { AlertService } from './../../../shared/alert/alert.service';
import { Page } from './../../../shared/view-models/page.model';
import { CrudService } from 'src/app/shared/services/crud.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RequestDocumentViewModel } from '../request-document.model';
import { RequestService } from '../request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap';

@Component( {
  selector: 'app-request-documents',
  templateUrl: './request-documents.component.html',
  // styleUrls: ['./index.component.css']
} )
export class RequestDocumentsComponent implements OnInit {
  page: Page = new Page();
  model: ReviewDocumentViewModel = new ReviewDocumentViewModel();
  isUploading = false;
  RequestID: number = 0;
  isPageLoaded = false;
  canEdit = true;
  isSaving = false;
  documents: string[] = [];
  modalRef: BsModalRef;
  doc:string="";
  type:string;
  url: SafeResourceUrl;
  @ViewChild( 'approveTemplate', { static: false } ) approveTemplate: any;

  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private crud: CrudService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public sanitizer:DomSanitizer,
    private _alertService: AlertService
  ) {

  }

  ngOnInit() {
    this.initializePage();
    if (localStorage.getItem("type")) {
      this.type=localStorage.getItem("type");
    }
   
  }
  disabledSubmit(): boolean {
    return this.isSaving || this.model.Documents.every( x => x.Attachments.length == 0 );
  }

  showApproveConfirmation(selected:string ) {
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://docs.google.com/gview?url="+selected+"&embedded=true");      
    this.url=this.sanitizer.bypassSecurityTrustResourceUrl(selected);
    this.modalRef = this.crud.modalService.show( this.approveTemplate, { class: 'modal-md' } );
  }
  initializePage() {
    this._activatedRoute.paramMap.subscribe( params => {
      this.RequestID = +params.get( 'id' );
      forkJoin( [
        this._requestService.getDocuments( this.RequestID ),

      ] ).subscribe( res => {
        this.model = res[0].Data;
        if ( this.model.Documents.some( x => x.Attachments.length > 0 ) )
          this.canEdit = false;
        this.model.Documents.forEach( item => {
          if ( item.Notes == null ) {
            item.Notes = "";
          }
        } )
        this.isPageLoaded = true;
      } );
    } )
  }
  onFileChanged( event, id ) {
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
        this._alertService.error( "Only allawable files are pdf , doc , docx" );
        this.myInputVariable.nativeElement.value = "";
      }
      else if ( isBiggerThan5MB == true ) {
        this._alertService.error( "Maximum file size is 5 MB" );
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
              attachment.AttachmentType = AttachmentType.PreviousAudit;
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if ( !this.model.Documents[id].Attachments )
                this.model.Documents[id].Attachments = [];
              this.model.Documents[id].Attachments.push( attachment );
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

  save() {
    this.isSaving = true;    
    this._requestService.postDocument( this.model.Documents ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        let requestID = response.Data as number;
        this.canEdit = false;
        this._alertService.success( response.Message );
        this._router.navigateByUrl( `/request` );
      }
      else {
        this._alertService.error( response.Message );
      }
    }, () => {
      this.isSaving = false;
    } );
  }
  removeAttachment( ID: number, index: number ) {
    this.model.Documents[ID].Attachments.splice( index, 1 );
  }
}
