import { AgreementService } from './../agreement.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgreementViewModel } from '../agreement.model';
import { BsModalRef } from 'ngx-bootstrap';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CrudService } from 'src/app/shared/services/crud.service';
import { AgreementUploadViewModel } from '../agreement-upload.model';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/layout/notification.service';
import {Notification} from '../../../shared/layout/notification'
@Component({
  // selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

 items: AgreementViewModel[] = [];
 modalRef: BsModalRef;
 doc = '';
 url: SafeResourceUrl;
 model: AgreementUploadViewModel = new AgreementUploadViewModel();
 isPageLoaded = false;
 filePath: string = null;
 isSaving = false;
 isUploaded = false;
 Notifications: Notification[]=[];
 NotesID: number;

 @ViewChild( 'showFiles', { static: false } ) showFiles: any;

  constructor(private _agreementService: AgreementService, public sanitizer: DomSanitizer,
              private _attachmentService: AttachmentService,
              private _alertService: AlertService,
              private _router: Router,
              private _notification: NotificationService,
              private crud: CrudService) { 



              }

  ngOnInit() {
this._agreementService.get().subscribe(response => {
  this.items = response.Data.Result;
});


  }

  showFile(selected: string ) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(selected);
    this.modalRef = this.crud.modalService.show( this.showFiles, { class: 'modal-md' } );
  }
  //  const file: FileList = event.target.files;

  onFileChanged( event, RequestID: number ) {
    this.model.AgreementID = RequestID;
    let isAllawableExt = true;
    let isBiggerThan5MB = false;
    this.isUploaded = false;
    const formData: FormData = new FormData();
    const file: FileList = event.target.files; ;
    const ext = file[0].name.split( '.' )[1];

    if ( ext != 'pdf' ) {
      isAllawableExt = false;
    } else if ( ( file[0].size / 1024 / 1024 ) > 5 ) {
      isBiggerThan5MB = true;
    } else {
      formData.append( 'uploadFile_' + 0, file[0], file[0].name );
    }
    if ( isAllawableExt == false ) {
      this._alertService.error( 'Only allawable files are pdf' );
    } else if ( isBiggerThan5MB == true ) {
      this._alertService.error( 'Maximum file size is 5 MB' );
    } else {
      this._attachmentService.upload( formData ).subscribe( response => {
        if ( response.Success ) {
          // tslint:disable-next-line: no-shadowed-variable
          const file = response.Data[0];
          this.model.FilePath = file.FilePath;
          this.model.FileName = file.FileName;
          this.model.Type = file.Extension;
        }
        this.save();

      },
        error => {
          this._alertService.error( 'Maximum file size is 5 MB' );
        }
        , () => { this.isUploaded = true; } );
    }


  }



  save() {
    this.isSaving = true;
    this.filePath = this.model.FilePath;
    this._agreementService.uploadConsumerFinancialOffer( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        const requestID = response.Data as number;
        this._notification.GetNotification().subscribe(data=>{
          this.Notifications=data.Data;
          this.Notifications.forEach((item) => {
            if(item.Type==20&&!item.Seen&&item.RequestID==this.model.AgreementID)
            // tslint:disable-next-line: one-line
            {
              this.NotesID=item.ID;
            }
    
          });
          this._notification.PostNotification(this.NotesID).subscribe(data=>{

            this._router.navigateByUrl(`/request`);
            this._alertService.success( response.Message );
            
          }, error => {
            this._router.navigateByUrl(`/request`);
            this._alertService.success( response.Message );
        });
        })
       

      } else {
        this._alertService.error( response.Message );
      }
    }, () => {
      this.isSaving = false;
    } );
  }
}
