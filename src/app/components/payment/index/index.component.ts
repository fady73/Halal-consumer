import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentViewModel } from '../payment.model';
import { PaymentService } from '../payment.service';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { CrudService } from 'src/app/shared/services/crud.service';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { PaymentUploadViewModel } from '../payment-upload.model';
import { environment } from 'src/environments/environment';
import { PaymentType } from '../payment-type.enum';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/shared/layout/notification.service';
import {Notification} from '../../../shared/layout/notification'
import { Router } from '@angular/router';
@Component( {
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
} )
export class IndexComponent implements OnInit {
  modalRef: BsModalRef;
  doc: string="";
  url: SafeResourceUrl;
  model: PaymentUploadViewModel = new PaymentUploadViewModel();
  isSaving = false;
  isUploaded = false;
  @ViewChild( 'approveTemplate', { static: false } ) approveTemplate: any;
  NotesID: number;

  items: PaymentViewModel[] = [];
  myNewList: PaymentViewModel[]=[]
  Notifications: Notification[]=[];

  closeResult: string;
  constructor(     private _notification: NotificationService,
                   private _router: Router,

                   private _paymentService: PaymentService,public sanitizer: DomSanitizer,
                   private _alertService: AlertService,
                   private _attachmentService: AttachmentService,
                   private crud: CrudService) {

  }

  ngOnInit() {
    this._paymentService.get().subscribe( response => {
      this.items = response.Data.Result;
      this.items.forEach((item, index) => {
          if (this.myNewList.findIndex(i => i.RequestID == item.RequestID) === -1) 
          {
            this.myNewList.push(item)
          }
      
      });
      this.items = this.myNewList

    } );
  }


  showApproveConfirmation(selected: string ) {
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://docs.google.com/gview?url="+selected+"&embedded=true");      
    this.url=this.sanitizer.bypassSecurityTrustResourceUrl(selected);
    this.modalRef = this.crud.modalService.show( this.approveTemplate, { class: 'modal-md' } );
  }

  onFileChangedPay1( event,RequestID: number ) {
    this.model.RequestID=RequestID

    let isAllawableExt = true;
    let isBiggerThan2MB = false;
    this.isUploaded = false;
    let formData: FormData = new FormData();
    const file: FileList = event.target.files;

    var ext = file[0].name.split( '.' )[1];

    if ( ext != "pdf" ) {
    isAllawableExt = false;
  }  else if ( ( file[0].size / 1024 / 1024 ) > environment.fileSize ) {
    isBiggerThan2MB = true;
  }
  else {
    formData.append( 'uploadFile_' + 0, file[0], file[0].name );
  }
    if ( isAllawableExt == false ) {
    this._alertService.error( "Only allawable files are pdf" );
  }
  else if ( isBiggerThan2MB == true ) {
    this._alertService.error( "Maximum file size is 2 MB" );
  }
  else {
    this._attachmentService.upload( formData ).subscribe( response => {
      if ( response.Success ) {
        // fileList = []

        let file = response.Data[0];
        this.model.FilePath = file.FilePath;
        this.model.FileName = file.FileName;
        this.model.Type = PaymentType.InvoicePayment1;
      }
      this.save();

    },
      error => {
        this._alertService.error( " Maximum file size is 2 MB" );
      }
      , () => { this.isUploaded = true; } );
  }

}


  onFileChangedPay2( event,RequestID: number ) {
      this.model.RequestID=RequestID

      let isAllawableExt = true;
      let isBiggerThan2MB = false;
      this.isUploaded = false;
      let formData: FormData = new FormData();
      const file: FileList = event.target.files;

      var ext = file[0].name.split( '.' )[1];

      if ( ext != "pdf" ) {
      isAllawableExt = false;
    }  else if ( ( file[0].size / 1024 / 1024 ) > environment.fileSize ) {
      isBiggerThan2MB = true;
    }
    else {
      formData.append( 'uploadFile_' + 0, file[0], file[0].name );
    }
      if ( isAllawableExt == false ) {
      this._alertService.error( "Only allawable files are pdf" );
    }
    else if ( isBiggerThan2MB == true ) {
      this._alertService.error( "Maximum file size is 2 MB" );
    }
    else {
      this._attachmentService.upload( formData ).subscribe( response => {
        if ( response.Success ) {
          // fileList = []
          let file = response.Data[0];
          this.model.FilePath = file.FilePath;
          this.model.FileName = file.FileName;
          this.model.Type = PaymentType.InvoicePayment2;
        }
        this.save();

      },
        error => {
          this._alertService.error( " Maximum file size is 2 MB" );
        }
        , () => { this.isUploaded = true; } );
    }

  }

  onFileChangedPay3( event,RequestID: number ) {
    this.model.RequestID=RequestID

    let isAllawableExt = true;
    let isBiggerThan2MB = false;
    this.isUploaded = false;
    let formData: FormData = new FormData();
    const file: FileList = event.target.files;

    var ext = file[0].name.split( '.' )[1];

    if ( ext != "pdf" ) {
    isAllawableExt = false;
  }  else if ( ( file[0].size / 1024 / 1024 ) > environment.fileSize ) {
    isBiggerThan2MB = true;
  }
  else {
    formData.append( 'uploadFile_' + 0, file[0], file[0].name );
  }
    if ( isAllawableExt == false ) {
    this._alertService.error( "Only allawable files are pdf" );
  }
  else if ( isBiggerThan2MB == true ) {
    this._alertService.error( "Maximum file size is 2 MB" );
  }
  else {
    this._attachmentService.upload( formData ).subscribe( response => {
      if ( response.Success ) {
        // fileList = []

        let file = response.Data[0];
        this.model.FilePath = file.FilePath;
        this.model.FileName = file.FileName;
        this.model.Type = PaymentType.InvoicePayment3;
      }
      this.save();

    },
      error => {
        this._alertService.error( " Maximum file size is 2 MB" );
      }
      , () => { this.isUploaded = true; } );
  }

}

  save() {
    this.isSaving = true;
    this._paymentService.post( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        let requestID = response.Data as number;
        this._alertService.success( response.Message );
        // this.isUploaded = false;
        this._notification.GetNotification().subscribe(data=>{
          this.Notifications=data.Data;
          this.Notifications.forEach((item) => {
            if(item.Type==9&&!item.Seen&&item.RequestID==this.model.RequestID)
            // tslint:disable-next-line: one-line
            {
              this.NotesID=item.ID;
            }
    
          })
          this._notification.PostNotification(this.NotesID).subscribe(data=>{
            this._router.navigateByUrl(`/request`)

          },error=>{       
             this._router.navigateByUrl(`/request`)
          })
        })

      }
      else {
        this._alertService.error( response.Message );
      }
    }, () => {
      this.isSaving = false;
    } );
  }


}
