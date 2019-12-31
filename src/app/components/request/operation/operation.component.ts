import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerViewModel } from '../../consumer/consumer-model';
import { AlertService } from '../../../shared/alert/alert.service';
import { CompanyService } from '../../../shared/services/company.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { OperationCreateViewModel } from './operation-create.model';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentType } from 'src/app/shared/enum/attachment-type';
import { UploadFile } from 'src/app/shared/view-models/upload-file';

@Component( {
  selector: 'app-operation',
  templateUrl: './operation.component.html',
} )

export class OperationComponent implements OnInit {
  form: FormGroup;
  model: OperationCreateViewModel = new OperationCreateViewModel();
  isPageLoaded = false;
  isSaving = false;
  isUploading = false;
  isEditable = false;
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;
  type: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router

  ) { }

  ngOnInit() {
    this.initializePage();
  }


  initializePage() {
    this._activatedRoute.paramMap.subscribe( params => {
      this.model.RequestID = +params.get( 'id' );
      forkJoin( [
        this._requestService.getOperationsDetails( this.model.RequestID ),
        this._requestService.getIsEditableSection( this.model.RequestID, 4 )

      ] ).subscribe( res => {
        this.model = res[0].Data;
        this.isEditable = res[1].Data;

        this.createForm();
        this.isPageLoaded = true;
      } );
    } )
  }

  resetForm() {
    if (localStorage.getItem("type")) {
      this.type=localStorage.getItem("type");
    }
    if(this.type=="0")
    this._router.navigateByUrl( `/request/regular-request/${this.model.RequestID}` )
    if(this.type=="1")
    this._router.navigateByUrl( `/request/recognition-request/${this.model.RequestID}` )
  }

  createForm() {
    this.form = this._formBuilder.group( {
      OperationsDetails: [this.model.OperationsDetails, [Validators.required]],
    }
    );
  }

  // onFileChanged(event) {

  //   this.isUploading = true;
  //   let fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     let formData: FormData = new FormData();
  //     for (let index = 0; index < fileList.length; index++) {
  //       let file: File = fileList[index];

  //       formData.append('uploadFile_' + index, file, file.name);
  //     }
  //     this._attachmentService.upload(formData).subscribe(response => {
  //       debugger
  //       if (response.Success) {
  //         let files: UploadFile[] = response.Data;

  //         for (let index = 0; index < files.length; index++) {
  //           let item = files[index];
  //           let attachment = new AttachmentCreateViewModel();
  //           attachment.AttachmentType = AttachmentType.OperationsDetails;
  //           attachment.FilePath = item.FilePath;
  //           attachment.FileName = item.FileName;
  //           attachment.FileName = item.FileName;
  //           if(!this.model.Attachments)
  //           this.model.Attachments=[];
  //           this.model.Attachments.push(attachment);
  //           this.isUploading = false;
  //         }

  //       }
  //     }, null, () => { this.isUploading = false; });

  //   }
  //   else {
  //     this.isUploading = false;
  //   }

  // }

  onFileChanged( event ) {
    this.isUploading = true;
    let isAllawableExt = true;
    let isBiggerThan2MB = false;
    let fileList: FileList = event.target.files;
    if ( fileList.length > 0 ) {
      let formData: FormData = new FormData();
      for ( let index = 0; index < fileList.length; index++ ) {
        let file: File = fileList[index];

        var ext = file.name.split( '.' )[1];

        if ( ext != "pdf" && ext != "docx" && ext != "doc" && ext != "jpeg" && ext != "jpg" && ext != "png" ) {
          isAllawableExt = false;
        }
        else if ( ( file.size / 1024 / 1024 ) > environment.fileSize ) {
          isBiggerThan2MB = true;
        }
        else {
          formData.append( 'uploadFile_' + index, file, file.name );
        }
      }
      if ( isAllawableExt == false ) {
        this._alertService.error( "Only allawable files are pdf, doc, docx, png, jpg, jpeg" );
        this.myInputVariable.nativeElement.value = "";
      }
      else if ( isBiggerThan2MB == true ) {
        this._alertService.error( "Maximum file size is 2 MB" );
        this.myInputVariable.nativeElement.value = "";
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
              if ( !this.model.Attachments )
                this.model.Attachments = [];
              this.model.Attachments.push( attachment );
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
  removeAttachment( index: number ) {
    this.model.Attachments.splice( index, 1 );
  }
  deleteFile() {
  }

  save() {
    if(this.form.valid){

    this.isSaving = true;
    Object.assign( this.model, this.form.value );
    this._requestService.PostOperations( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        let requestID = response.Data as number;
        //this._alertService.success(response.Message);
        this._requestService.getEditableSections(this.model.RequestID).subscribe(response=>{
          let sections=response.Data;
          this._requestService.navigateToNextEditableSection(this.model.RequestID,4,sections);
        });
        //this._router.navigateByUrl( `/request/sales/${this.model.RequestID}` )
        //this._router.navigateByUrl(`/request/sales/${this.model.RequestID}`)
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
