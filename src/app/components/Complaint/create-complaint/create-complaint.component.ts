import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ComplaintUploadModel } from '../complaint-upload-model';

import { Page } from 'src/app/shared/view-models/page.model';
import { NotificationService } from 'src/app/shared/layout/notification.service';
import { ComplaintServiceService } from '../complaint-service.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ComplaintModel } from '../complaint-model';
import { SelectItem } from 'src/app/shared/view-models/select-view-model';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentType } from 'src/app/shared/enum/attachment-type';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css']
})
export class CreateComplaintComponent implements OnInit {
  form: FormGroup;
  model: ComplaintModel = new ComplaintModel();
  isPageLoaded = false;
  isSaving = false;
  isUploading = false;
  isEditable = false;
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;
  type: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _complaintService: ComplaintServiceService,
    private _alertService: AlertService,
    // private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router

  ) { }

  ngOnInit() {
    this.createForm();
    this.isPageLoaded = true;
  }


  
 

  createForm() {
    this.form = this._formBuilder.group( {
      Content: [this.model.Content, [Validators.required]],
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
           
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if ( !this.model.ComplaintDocuments )
                this.model.ComplaintDocuments = [];
              this.model.ComplaintDocuments.push( attachment );
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
    this.model.ComplaintDocuments.splice( index, 1 );
  }
  deleteFile() {
  }

  save() {
    if(this.form.valid){

    this.isSaving = true;
    Object.assign( this.model, this.form.value );
    this._complaintService.post( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
       
       
        this._router.navigateByUrl(`/complaint`)
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
