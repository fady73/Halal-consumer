import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from 'src/app/shared/view-models/page.model';
import { PaymentUploadViewModel } from '../payment-upload.model';
import { NotificationService } from 'src/app/shared/layout/notification.service';
import { PaymentService } from '../payment.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { PaymentType } from '../payment-type.enum';

@Component({
  selector: 'app-payment4',
  templateUrl: './payment4.component.html',
  styleUrls: ['./payment4.component.css']
})
export class Payment4Component implements OnInit {

  page: Page = new Page();
  model: PaymentUploadViewModel = new PaymentUploadViewModel();
  isPageLoaded = false;
  isSaving = false;
  isUploaded = false;
  Notifications:Notification[]=[];
  NotesID:number;
  item:Notification;
  @ViewChild( 'dropzone', { static: false } )
  dropzone: any;
  constructor(    private _notification:NotificationService,
    private _paymentService: PaymentService, private crud: CrudService, private _attachmentService: AttachmentService,
     private _activatedRoute: ActivatedRoute, private _alertService: AlertService, private _router: Router ) {
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this._activatedRoute.paramMap.subscribe( params => {
      if ( params.has( 'id' ) ) {
        this.model.RequestID = +params.get( 'id' );
        //alert(this.model.ID);
      }
    } );
  }
  onFileChanged( file: File ) {
    let isAllawableExt = true;
    let isBiggerThan5MB = false;
    this.isUploaded = false;
    let formData: FormData = new FormData();
    var ext = file[0].name.split( '.' )[1];
    if ( ext != "pdf" ) {
      isAllawableExt = false;
    }
    else if ( ( file[0].size / 1024 / 1024 ) > 5 ) {
      isBiggerThan5MB = true;
    }
    else {
      formData.append( 'uploadFile_' + 0, file[0], file[0].name );
    }
    if ( isAllawableExt == false ) {
      this._alertService.error( "Only allawable files are pdf" );
      this.dropzone.reset();
    }
    else if ( isBiggerThan5MB == true ) {
      this._alertService.error( "Maximum file size is 5 MB" );
      this.dropzone.reset();
    }
    else {
      this._attachmentService.upload( formData ).subscribe( response => {
        if ( response.Success ) {
          // fileList = []
          this.dropzone.reset();
          let file = response.Data[0];
          this.model.FilePath = file.FilePath;
          this.model.FileName = file.FileName;
          this.model.Type = PaymentType.InvoicePayment4;
        }
      }, error => {
        this._alertService.error( "Maximum file size is 5 MB" );
      }, () => { this.isUploaded = true; } );
    }
  }
  removeAttachment() {
    this.model.FilePath = "";
    this.model.FileName = "";
  }
  deleteFile() {
  }
  save() {
    this.isSaving = true;
    this._paymentService.post( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ){
        let requestID = response.Data as number;
        this._alertService.success( response.Message );
        // this.isUploaded = false;
        this._notification.GetNotification().subscribe(data=>{
          this.Notifications=data.Data;
          
          this.Notifications.forEach((item) => {
         
              this.NotesID;
           

    
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
