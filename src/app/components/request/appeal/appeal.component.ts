import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppealModel } from '../appeal-model';
import { RequestService } from '../request.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentType } from 'src/app/shared/enum/attachment-type';

@Component({
  selector: 'app-appeal',
  templateUrl: './appeal.component.html',
  styleUrls: ['./appeal.component.css']
})
export class AppealComponent implements OnInit {

  form: FormGroup;
  model: AppealModel = new AppealModel();
  isPageLoaded = false;
  isSaving = false;
  isUploading = false;
  isEditable = false;
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;
  type: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _requestService: RequestService,
    private _alertService: AlertService,
    // private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router

  ) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe( params => {
      this.model.RequestID = +params.get( 'id' );
    });
    this.createForm();
    this.isPageLoaded = true;
  }


  
 

  createForm() {
    this.form = this._formBuilder.group( {
      Message: [this.model.Message, [Validators.required]],
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
              attachment.AttachmentType=AttachmentType.AppealDocuments,
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if ( !this.model.AppealAttachments )
                this.model.AppealAttachments = [];
              this.model.AppealAttachments.push( attachment );
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
    this.model.AppealAttachments.splice( index, 1 );
  }
  deleteFile() {
  }

  save() {
    if(this.form.valid){

    this.isSaving = true;
    Object.assign( this.model, this.form.value );
    console.log(this.model)
    this._requestService.postappeal( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
       
       
        this._router.navigateByUrl(`/request`)
      }
      else {
        this._router.navigateByUrl(`/request`)
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
