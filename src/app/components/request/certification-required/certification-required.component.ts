import { CompanyThirdPartyCertificationCreateViewModel } from './../company-third-party-certification-create.model';
import { AttachmentType } from './../../../shared/enum/attachment-type';
import { AttachmentCreateViewModel } from './../../../shared/view-models/attachment-create.model';
import { AttachmentService } from './../../../shared/services/attachment.service';
import { UploadFile } from './../../../shared/view-models/upload-file';
import { SelectItem } from './../../../shared/view-models/select-view-model';
import { ConsumerViewModel } from './../../consumer/consumer-model';
import { AlertService } from './../../../shared/alert/alert.service';
import { CompanyService } from './../../../shared/services/company.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { RequiredCertificateCreateViewModel, RequestCertificateTypeCreateViewModel } from './required-certificate-create.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CertificateType } from '../certificate-type.enum';
import { CertificateCompanyViewModel } from '../../company/certificate-company.model';
import { Certificate } from 'crypto';

@Component( {
  selector: 'app-create',
  templateUrl: './certification-required.component.html',
} )

export class CertificationRequiredComponent implements OnInit {
  form: FormGroup;
  model: RequiredCertificateCreateViewModel = new RequiredCertificateCreateViewModel();
  // Consumer:ConsumerViewModel=new ConsumerViewModel();
  isPageLoaded = false;
  isSameAddressChecked = false;
  isPartGroup = false;
  isUploading = false;
  isSaving = false;
  certificates: SelectItem[] = [];
  companyCertificates: CompanyThirdPartyCertificationCreateViewModel[] = [];
  types: SelectItem[] = [];
  canEdit = false;
  isOtherSelected = false;

  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _activatedRoute: ActivatedRoute,
    private _attachmentService: AttachmentService,
    private _route: Router

  ) { }

  ngOnInit() {
    this.initializePage();
  }
  initializePage() {

    this._activatedRoute.paramMap.subscribe( params => {
      this.model.ID = +params.get( 'id' );


      forkJoin( [
        this._requestService.getEditableRequiredCertificate( this.model.ID ),
        this._requestService.getCertificateTypeList(),
        this._requestService.getCompanyThirdPartyCertifications(),
        this._requestService.getIsEditableSection( this.model.ID, 2 )
      ] ).subscribe( response => {
        //this.Consumer = response[0].Data;
        this.model = response[0].Data;
        if ( this.model == null )
          this.model = new RequiredCertificateCreateViewModel();

        if ( !this.model.PreviousAuditAttachments )
          this.model.PreviousAuditAttachments = [];
        if ( !this.model.CompanyCertifications )
          this.model.CompanyCertifications = [];
          if ( !this.model.CertificateTypes )
          this.model.CertificateTypes = [];
        this.certificates = response[1].Data;
        this.companyCertificates = response[2].Data;
        this.canEdit = response[3].Data;

        // alert( this.canEdit );
        this.companyCertificates.forEach( item => {
          item.CertificateCompanyID = item.ID;
          item.ID = 0;
          item.IsSelected = false;
          // let selectedCertification = this.model.CompanyCertifications.find( x => x.CertificateCompanyID == item.CertificateCompanyID );
          // if ( selectedCertification ) {
          //   item.ID = selectedCertification.ID;
          //   item.CertificationBody = selectedCertification.CertificationBody;
          //   item.IsSelected = true;
          // }
        } );

        // if(this.companyCertificates && this.companyCertificates.length>0)
        //   this.companyCertificates.forEach(item=>{
        //     item.IsSelected=false;
        //     this.model.CompanyCertifications.filter(x=>x.CertificateCompanyID==item.ID).forEach(c=>{
        //       item.IsSelected=true;
        //       item.CertificationBody=c.CertificationBody;
        //     });
        //   });

        this.createForm();
        this.isPageLoaded = true;
      } );
    } );

  }
  onHaveThirdPartyCertificationChanged( status: boolean ) {
    //alert(status);
    this.model.CompanyCertified = status;//this.form.controls["CompanyCertified"].value as boolean;
    this.companyCertificates.forEach( item => {
      item.IsSelected = false;
      item.CertificationBody = "";
    } );
  }
  createForm() {
    this.form = this._formBuilder.group( {

      CertificateDescription: [''],
      // CertificateType: [this.model.CertificateType, [Validators.required]],
      CompanyCertified: [this.model.CompanyCertified],
      PreviousAudit: [this.model.PreviousAudit, [Validators.maxLength( 400 )]],
      //RequestTypeDescription: [this.model.RequestTypeDescription, [Validators.maxLength(400)]],

    }
      //this.form.controls["Name"].disable()
    );
  }

  onFileChanged( event ) {
    this.isUploading = true;
    let isAllawableExt = true;
    let fileList: FileList = event.target.files;
    if ( fileList.length > 0 ) {
      let formData: FormData = new FormData();
      for ( let index = 0; index < fileList.length; index++ ) {
        let file: File = fileList[index];

        var ext = file.name.split( '.' )[1];

        if ( ext != "pdf" && ext != "docx" && ext != "doc" ) {
          isAllawableExt = false;
        }
        else {
          formData.append( 'uploadFile_' + index, file, file.name );
        }
      }
      if ( isAllawableExt == false ) {
        this._alertService.error( "Only allawable files are pdf , doc , docx" );
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
              if ( !this.model.PreviousAuditAttachments )
                this.model.PreviousAuditAttachments = [];
              this.model.PreviousAuditAttachments.push( attachment );
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
    this.model.PreviousAuditAttachments.splice( index, 1 );
  }
  onOtherCertificateChecked(item:SelectItem) {
    console.log(item)
    const control = this.form.controls['CertificateDescription'];

    if(item.Name=="Other"&&item.Selected)
    {
    this.isOtherSelected = true;
      control.setValidators( [Validators.required] );
      
    
    this.form.patchValue( {
      "CertificateDescription": ""
    } );  
  }
    if(item.Name=="Other"&&!item.Selected){
      this.isOtherSelected=false
      this.form.patchValue( {
        "CertificateDescription": "null"
      } );
      control.setValidators( null );
    }

    
  }




  resetForm() {
    this._route.navigateByUrl( `/request/edit/${this.model.ID}` );
  }

  save() {
if(this.form.valid){
    this.isSaving = true;
    
    this.model.CompanyCertified=this.form.value.CompanyCertified;
    this.model.PreviousAudit=this.form.value.PreviousAudit;

    //Object.assign( this.model, this.form.value );
    //this.model.ID=33;
    this.model.CertificateTypes=[]
      this.certificates.filter( x => x.Selected == true ).forEach( item => {
        let CertificateTypeSelect = new RequestCertificateTypeCreateViewModel();
        CertificateTypeSelect.ID = item.ID;
        if(item.ID==CertificateType.Other)
        {
          CertificateTypeSelect.CertificateDescription=this.form.value.CertificateDescription;


        }else{
          CertificateTypeSelect.CertificateDescription=item.Name;}
          CertificateTypeSelect.CertificateType=item.ID;
          CertificateTypeSelect.RequestID = this.model.ID;
        this.model.CertificateTypes.push( CertificateTypeSelect );
      } );
      console.log(this.model)
    this.companyCertificates.forEach( item => {
      if ( item.IsSelected ) {
        item.ReqularRequestID = this.model.ID;
        this.model.CompanyCertifications.push( item );
      }

    } );
    
 console.log(JSON.stringify(this.model))
    this._requestService.POSTRequiredCertificate( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        //this._alertService.success(response.Message);
        //this._route.navigateByUrl( `/request/regular-request/${this.model.ID}` )
        this._requestService.getEditableSections( this.model.ID ).subscribe( response => {
          let sections = response.Data;
          this._requestService.navigateToNextEditableSection( this.model.ID, 2, sections );
        } );
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


