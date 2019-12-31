import { SelectItem } from '../../../shared/view-models/select-view-model';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerViewModel } from '../../consumer/consumer-model';
import { AlertService } from '../../../shared/alert/alert.service';
import { CompanyService } from '../../../shared/services/company.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { RequestDetailsCreateViewModel } from '../request-details-create.model';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentType } from 'src/app/shared/enum/attachment-type';
import { CRUDIndexPage } from '../../../shared/view-models/crud-index.model';
import { RecognitionRequestCreateViewMode } from './recognition-request-create.model';
import { RecognitionRequestService } from './recognition-request.service';
import { RequestCommentViewModel } from '../request-comment.model';

@Component({
  templateUrl: './recognition-request.component.html',
})

export class RecognitionRequestComponent implements OnInit {
  form: FormGroup;
  page: CRUDIndexPage = new CRUDIndexPage();

  model: RecognitionRequestCreateViewMode = new RecognitionRequestCreateViewMode();
  Consumer: ConsumerViewModel = new ConsumerViewModel();
  isPageLoaded = false;
  isUploading = false;
  isSaving = false;
  isEditable = false;
  comments: RequestCommentViewModel[] = [];
  marked = false;
  error=false;

  haveLocalActivities = false;
  cities: SelectItem[] = [];
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;
  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _recognitionRequestService: RecognitionRequestService,
    private _attachmentService: AttachmentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {
    this.initializePage();
  }

  initializePage() {
    this._activatedRoute.paramMap.subscribe(params => {
      this.model.RequestID = +params.get('id');
      forkJoin([
      this._companyService.getLoggedConsumerCopmany(),
      this._recognitionRequestService.getEditableByID(this.model.RequestID),
      this._requestService.getCountryList(),
      this._requestService.getIsEditableSection( this.model.RequestID, 3 ),
      this._requestService.getComments( this.model.RequestID ),
      this._recognitionRequestService.GetCertificateCountry(this.model.RequestID)


    ]).subscribe(response => {
      this.model = response[1].Data;
      this.isEditable = response[3].Data;
      this.model.RequestID = +params.get( 'id' );
      this.comments = response[4].Data;
      this.comments = this.comments.filter( x => x.StepNumber == 3 );
      this.cities = response[2].Data.Result;
      if(!this.model.ScopeAttachments){
        this.marked=false;
        this.error=false;

      }else{
        this.marked=true;
        this.error=true;

      }
      if(this.model.ScopeAttachments.length){
        this.marked=true;
        this.error=false;

      }
     
      if(!this.model.RegistrationScope){
        this.marked=true;
        this.error=true;

      }else{
        this.marked=false;
        this.error=false;
      }
      
      if (this.model == null) {
        this.model = new RecognitionRequestCreateViewMode();


}
      this.page.options.currentPage = 1;
      this.page.options.itemsPerPage = 4;
      this.page.options.totalItems = 80;
      this.page.options.totalPages = 10;
      this.model.HaveLocalActivities = false;
      if ( this.model.Exclusions != null && this.model.Exclusions != '' ) {
          this.model.HaveLocalActivities = true;
      }

      this.createForm();

      this.isPageLoaded = true;
    });
  });

  }
  fileOr()
  {
    const control = this.form.controls['RegistrationScope'];
    if(this.marked){
      this.marked=false;
      this.error=false;

      control.setValidators( [Validators.required, Validators.maxLength( 200 )] );

    }
    else{
      this.marked=true;
      control.setValidators( null );
      if(this.model.ScopeAttachments.length){
        this.error=false;
      }
      else{
        this.error=true;
      }
    }
    control.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  onFileChanged( event ) {
    this.isUploading = true;
    let isAllawableExt = true;
    const fileList: FileList = event.target.files;
    if ( fileList.length > 0 ) {
      const formData: FormData = new FormData();
      for ( let index = 0; index < fileList.length; index++ ) {
        const file: File = fileList[index];

        let ext = file.name.split( '.' )[1];

        if ( ext != 'pdf' && ext != 'docx' && ext != 'doc' ) {
          isAllawableExt = false;
        } else {
          formData.append( 'uploadFile_' + index, file, file.name );
        }
      }
      if ( isAllawableExt == false ) {
        this._alertService.error( 'Only allawable files are pdf , doc , docx' );
        this.myInputVariable.nativeElement.value = '';
      } else {
        this._attachmentService.upload( formData ).subscribe( response => {
          if ( response.Success ) {
            const files: UploadFile[] = response.Data;

            for ( let index = 0; index < files.length; index++ ) {
              const item = files[index];
              const attachment = new AttachmentCreateViewModel();
              attachment.AttachmentType = AttachmentType.Scope;
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if ( !this.model.ScopeAttachments ) {
                this.model.ScopeAttachments = [];
              }
              this.model.ScopeAttachments.push( attachment );
              this.isUploading = false;
            }
            this.form.controls.RegistrationScope.setValidators( null );
            this.form.controls.RegistrationScope.updateValueAndValidity();
            this.myInputVariable.nativeElement.value = '';
          }
                this.error=false;

        }, null, () => { this.isUploading = false; } );
      }

    } else {
      this.isUploading = false;
    }

  }
  removeAttachment( index: number ) {
    this.model.ScopeAttachments.splice( index, 1 );
    if ( this.model.ScopeAttachments.length == 0 ) {
      this.error=true;
    }
  }







  createForm() {
    this.form = this._formBuilder.group({
      RegistrationScope: [this.model.RegistrationScope, []],
      HaveLocalActivities: [this.model.HaveLocalActivities, [Validators.required]],
      Exclusions: [this.model.Exclusions, []],
      OutsourcedSpecialistOperations: [this.model.OutsourcedSpecialistOperations, [Validators.required, Validators.maxLength(200)]],
      ConsultancyRelatingDetails: [this.model.ConsultancyRelatingDetails, [Validators.required, Validators.maxLength(200)]],
      TotalEmployeesNumber: [this.model.TotalEmployeesNumber, [Validators.required, Validators.pattern(Patterns.OnlyNumbers), Validators.min(0)]],
      TotalContractualEmployeesNumber: [this.model.TotalContractualEmployeesNumber, [Validators.required, Validators.pattern(Patterns.OnlyNumbers), Validators.min(0)]],
      CertificationsCount: [this.model.TotalContractualEmployeesNumber, [Validators.required, Validators.pattern(Patterns.OnlyNumbers), Validators.min(0)]],
      TotalAnnualRevenue: [this.model.TotalContractualEmployeesNumber, [Validators.required, Validators.pattern(Patterns.OnlyNumbers), Validators.min(0)]],
      CertificateCountriesIDs: [this.model.CertificateCountriesIDs, [Validators.required]]




      // Name: [this.model.GrossAnnualTurnover, [Validators.required]],




    }
      // this.form.controls["Name"].disable()
    );
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}
  get controls() {
    return this.form.controls;
  }

  onHaveLocalActivitiesChanged( status ) {
    // alert(status);

    this.model.HaveLocalActivities = status;
    const control = this.form.controls['Exclusions'];
    if ( status ) {
      control.setValidators( [Validators.required, Validators.maxLength( 200 )] );
    } else {
      control.setValidators( null );
    }
    control.updateValueAndValidity();
    this.form.updateValueAndValidity();

  }




  resetForm() {
    this._router.navigateByUrl(`/request/certification-required/${this.model.RequestID}`);
    // this.model = new RecognitionRequestCreateViewMode();
    // this.createForm();
  }
  save() {

    if (this.form.valid&&!this.error) {

    this.isSaving = true;
    Object.assign(this.model, this.form.value);
    this._recognitionRequestService.post(this.model).subscribe(response => {
      this.isSaving = true;
      if (response.Success) {
        const requestID = response.Data as number;
        this._router.navigateByUrl(`/request/operation/${this.model.RequestID}`);
      } else {
        this._alertService.error(response.Message);

      }
    }, () => {
      this.isSaving = false;
    });
  } else {
    this.validateAllFormFields(this.form); // {7}

  }

}
validateAllFormFields(formGroup: FormGroup) {         // {1}
  Object.keys(formGroup.controls).forEach(field => {  // {2}
    const control = formGroup.get(field);             // {3}
    if (control instanceof FormControl) {             // {4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        // {5}
      this.validateAllFormFields(control);            // {6}
    }
  });
}
  onFilesAdded(files: File[]) {

    files.forEach(file => {
      const reader = new FileReader();
      // this.files += file.name + '/n';
      reader.onload = (e: ProgressEvent) => {
        const content = (e.target as FileReader).result;

        // this content string could be used directly as an image source
        // or be uploaded to a webserver via HTTP request.
      };

      // use this for basic text files like .txt or .csv
      reader.readAsText(file);

      // use this for images
      // reader.readAsDataURL(file);
    });
  }

  onFilesRejected(files: File[]) {
  }

}
