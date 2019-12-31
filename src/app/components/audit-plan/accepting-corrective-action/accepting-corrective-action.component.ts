import { AttachmentService } from './../../../shared/services/attachment.service';
import { AttachmentCreateViewModel } from './../../../shared/view-models/attachment-create.model';
import { UploadFile } from './../../../shared/view-models/upload-file';
import { NCSCorrectiveActionCreateViewModel } from './../ncr/ncs-corrective-action-create';
import { CrudService } from './../../../shared/services/crud.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NCSCABAcceptanceCreateViewModel } from '../ncr/ncs-cap-acceptance-create';
import { Router, ActivatedRoute } from '@angular/router';
import { NCRViewModel } from '../ncr/ncr.model';
import { AuditPlanViewModel } from '../audit-plan.model';
import { NcrService } from '../ncr.service';
import { AuditPlanService } from '../audit-plan.service';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { CRUDCreatePage } from 'src/app/shared/view-models/crud-create.model';
import { TodayValidator } from 'src/app/shared/common/patterns';
import { NotePayment } from '../../../shared/layout/notification';
import { NotificationService } from 'src/app/shared/layout/notification.service';
import {Notification} from '../../../shared/layout/notification'

@Component( {
  selector: 'app-accepting-corrective-action',
  templateUrl: './accepting-corrective-action.component.html',
  styleUrls: ['./accepting-corrective-action.component.css']
} )
export class AcceptingCorrectiveActionComponent implements OnInit {
  isPageLoaded: boolean = false;
  page: CRUDCreatePage = new CRUDCreatePage();
  timeError:boolean;
  Notifications:Notification[]=[];
  NotesID:number;
  model: NCRViewModel = new NCRViewModel();
  RequestID: number = 0
  auditPlan: AuditPlanViewModel = new AuditPlanViewModel();
  notes:NotePayment[]=[];
  isUploading = false;
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;

  constructor( private _NcrService: NcrService,
    private _auditPlanService: AuditPlanService,
    private _crudService: CrudService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _notification:NotificationService,

  ) {

  }

  ngOnInit() {
    this.timeError=true;

    this._activatedRoute.paramMap.subscribe( params => {
      this.model.RequestID = +params.get( 'id' );
      this.RequestID = this.model.RequestID;
      this.getByRequestID( this.model.RequestID );

      //this.getAuditPlan(this.model.AuditPlanID);


      this._notification.GetNotification().subscribe(data=>{
        this.Notifications=data.Data;
        this.Notifications.forEach((item) => {
          if(item.Type==14&&!item.Seen&&item.RequestID==this.RequestID)
          {
            this.notes.push(item)
         

          }
         
        })
      
       
      })
      
    } );

   
  }
  // getAuditPlan( id: number ) {
  //   this._auditPlanService.getById( id ).subscribe( resposne => {
  //     this.auditPlan = resposne.Data;
  //   } );
  // }
  getByRequestID( id: number ) {
    this._NcrService.getByRequestID( this.model.RequestID ).subscribe( response => {
      this.model = response.Data;
      if ( !this.model.NCSs )
        this.model.NCSs = [];
      this.model.NCSs.forEach( item => {
        item.CABAcceptance = false;
        //item.ImplementationPeriod=new Date();
        item.ImplementationPeriod = moment( new Date() ).format( 'MM-DD-YYYY' )
        this.page.form = this._crudService.formBuilder.group( {
          ImplementationPeriod: [moment( item.ImplementationPeriod ).format( 'MM-DD-YYYY' ), [TodayValidator]],
        } )
      } );

      this.isPageLoaded = true;
    } );
  }
   today(){
    this.timeError=false;
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
  // console.log(  this.page.form.value.ImplementationPeriod)
    let ncs: NCSCorrectiveActionCreateViewModel[] = [];
    this.model.NCSs.forEach( item => {
       console.log(this.page.form.value.ImplementationPeriod)
      ncs.push( { NCSID: item.ID, CorrectiveAction: item.CorrectiveAction, ImplementationPeriod:moment(this.page.form.value.ImplementationPeriod) , SuppliedDocuments:item.SuppliedDocuments} );
    } );
console.log(JSON.stringify(this.model.NCSs))
console.log(ncs[0].ImplementationPeriod)
// console.log( this.model.NCSs[0].ImplementationPeriod)

    this._NcrService.POSTCorrectiveAction( ncs ).subscribe( response => {
      if ( response.Success ) {
            
        this._notification.GetNotification().subscribe(data=>{
          this.Notifications=data.Data;
          this.Notifications.forEach((item) => {
            if(item.Type==14&&!item.Seen&&item.RequestID==this.RequestID)
            {
              this._notification.PostNotification(item.ID).subscribe(data=>{
    
              })
    
            }
           
          })
        
         
        })
        this._crudService.alert.success( response.Message );
        this._router.navigateByUrl( `/request` );
      }
      else {
        // this._crudService.alert.error( response.Message );
      }
      

    } );
  }

}
