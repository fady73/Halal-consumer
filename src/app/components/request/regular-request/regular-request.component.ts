import { SelectItem } from './../../../shared/view-models/select-view-model';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerViewModel } from '../../consumer/consumer-model';
import { AlertService } from '../../../shared/alert/alert.service';
import { CompanyService } from '../../../shared/services/company.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Patterns, MinusValidator } from 'src/app/shared/common/patterns';
import { RequestDetailsCreateViewModel } from '../request-details-create.model';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentType } from 'src/app/shared/enum/attachment-type';
import { CRUDIndexPage } from '../../../shared/view-models/crud-index.model';
import { RegularRequestCreateViewModel } from './regular-request-create.model';
import { RegularRequestService } from '../regular-request.service';
import { ProductFamily } from './product-family.model';
import { BusinessConditionViewModel } from './business-condition.model';
import { AdditionalSiteCreateViewModel } from './additional-site-create.model';
import { TimeScaleViewModel } from './time-scale.model';
import { RequestCommentViewModel } from '../request-comment.model';

@Component( {
  templateUrl: './regular-request.component.html',
} )

export class RegularRequestComponent implements OnInit {
  form: FormGroup;
  productFamilyForm: FormGroup;
  additionalSiteForm: FormGroup;
  page: CRUDIndexPage = new CRUDIndexPage();
  model: RegularRequestCreateViewModel = new RegularRequestCreateViewModel();
  Consumer: ConsumerViewModel = new ConsumerViewModel();
  businessConditions: SelectItem[] = [];
  //productFamilies:ProductFamily[]=[];
  timeScales: SelectItem[] = [];
  ftAreas: SelectItem[] = [];
  m2Areas: SelectItem[] = [];
  ftmarked = false;
  isPageLoaded = false;
  isUploading = false;
  isSaving = false;
  marked = false;
  hasAdditionalSites = false;
  additionalSites = false;
  haveLocalActivities = false;
  ft = false;
  m2 = false;
  m2marked = false;
  files: string;
  markedInput = false;
  error=false;

  comments: RequestCommentViewModel[] = [];
  isEditable = false;
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;

  // newProductFamily: ProductFamilyCreateViewModel = new ProductFamilyCreateViewModel();

  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _regularRequestService: RegularRequestService,
    private _attachmentService: AttachmentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {

    this.initializePage();
  }
  

  initializePage() {
    this._activatedRoute.paramMap.subscribe( params => {
      this.model.RequestID = +params.get( 'id' );
      //alert(this.model.RequestID);
      forkJoin( [
        this._companyService.getLoggedConsumerCopmany(),
        this._requestService.getBusinessConditions(),
        this._requestService.getTimeScales(),
        this._regularRequestService.getProductionFloorAreaInFeetList(),
        this._regularRequestService.getProductionFloorAreaInMeterList(),
        this._regularRequestService.getEditableByID( this.model.RequestID ),
        this._requestService.getComments( this.model.RequestID ),
        this._requestService.getIsEditableSection( this.model.RequestID, 3 )


      ] ).subscribe( response => {
        this.businessConditions = response[1].Data;
        this.timeScales = response[2].Data;
        this.ftAreas = response[3].Data;
        this.m2Areas = response[4].Data;
        this.model = response[5].Data;
        if(this.model.GrossAnnualTurnover==null)
        {    this.model.GrossAnnualTurnover=0;
        }

        if(!this.model.RegistrationScope){
          this.markedInput=false;
          this.error=false;
  
        }else{
          this.markedInput=true;
          this.error=true;
  
        }
        if(this.model.ScopeAttachments.length){
          this.markedInput=true;
          this.error=false;
        }
        this.comments = response[6].Data;
        this.comments = this.comments.filter( x => x.StepNumber == 3 );
        this.isEditable = response[7].Data;

        if ( this.model == null ) {
          this.model = new RegularRequestCreateViewModel();


        }
        if ( !this.model.ProductFamilies )
          this.model.ProductFamilies = [];
        this.model.RequestID = +params.get( 'id' );

        this.ftmarked = this.ftAreas.some( x => x.ID == this.model.ProductionFloorArea );
        if ( this.model.Exclusions != null && this.model.Exclusions != "" )
          this.model.HaveLocalActivities = true;
        if ( this.model.AdditionalSites && this.model.AdditionalSites.length > 0 ) {
          this.hasAdditionalSites = true;
        }
        this.businessConditions.forEach( item => {
          if ( this.model.BusinessConditions.some( x => x.BusinessConditionID == item.ID ) ) {
            item.Selected = true;
          }
        } );
        this.timeScales.forEach( item => {
          if ( this.model.TimeScales.some( x => x.TimeScaleID == item.ID ) ) {
            item.Selected = true;
          }
        } );
        this.page.options.currentPage = 1;
        this.page.options.itemsPerPage = 4;
        this.page.options.totalItems = 80;
        this.page.options.totalPages = 10;

        if ( this.model.ProductFamilies.length == 0 ) {
          let productfamily = new ProductFamily();
          productfamily.ID = 0;
          productfamily.NameArabic = "";
          productfamily.NameEnglish = "";
          productfamily.ProductTypes.push( { ID: 0, NameEnglish: '', NameArabic: '', ProductFamilyID: 0 } );
          this.model.ProductFamilies.push( productfamily );
        }
        this.createForm();
        this.createAdditionalSiteForm();
        this.createProductFamilyForm();
        this.isPageLoaded = true;
      } );
    } );
  }
  addProductType( familyIndex: number ) {

    let family = this.model.ProductFamilies[familyIndex];
    if ( !this.model.ProductFamilies[familyIndex].ProductTypes )
      this.model.ProductFamilies[familyIndex].ProductTypes = [];
    this.model.ProductFamilies[familyIndex].ProductTypes.push( { ID: 0, NameArabic: '', NameEnglish: '', ProductFamilyID: family.ID } );
  }
  removeLastProductType( familyIndex: number ) {
    this.model.ProductFamilies[familyIndex].ProductTypes.pop();
    if ( this.model.ProductFamilies[familyIndex].ProductTypes.length == 0 ) {
      this.model.ProductFamilies.splice( familyIndex, 1 );
    }
  }
  fileOr()
  {
    const control = this.form.controls['RegistrationScope'];
    if(this.markedInput){
      this.markedInput=false;
      this.error=false;
      control.setValidators( [Validators.required, Validators.maxLength( 200 )] );

    }
    else{
      this.markedInput=true;
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
  addProductFamily() {
    this.model.ProductFamilies.push( { ID: 0, NameArabic: '', NameEnglish: '', RegularRequestID: this.model.ID, ProductTypes: [{ ID: 0, NameArabic: '', NameEnglish: '', ProductFamilyID: 0 }] } );
  }
  removeLastProductFamily() {
    this.model.ProductFamilies.pop();
  }

  removeAdditionalSite( siteIndex ) {
    this.model.AdditionalSites.splice( siteIndex, 1 );
  }

  removeLastAdditionalSite() {
   this.additionalSiteForm.reset();
  }

  getNextPrevData( pageIndex ) {
    this.page.options.currentPage = pageIndex;
  }
  createProductFamilyForm() {
    this.productFamilyForm = this._formBuilder.group( {
      items: this._formBuilder.array( [this.createItem()] )
    } );
  }
  createItem(): FormGroup {
    return this._formBuilder.group( {
      Name: '',
      Types: this._formBuilder.array( [this._formBuilder.group( { Type: '' } )] )
    } );
  }

  ///////// This is new ////////
  get ProductTypes() {
    var prodTypes;
    this.productFamilyForm.get( 'items' )['controls'].forEach( element => {
      prodTypes = element.get( 'Types' );
    } );
    return prodTypes as FormArray;
  }

  addType() {
    this.ProductTypes.push( this._formBuilder.group( { Type: '' } ) );
  }


  createForm() {
    this.form = this._formBuilder.group( {
      RegistrationScope: [this.model.RegistrationScope,[]],
      HaveLocalActivities: [this.model.HaveLocalActivities, [Validators.required]],
      Exclusions: [this.model.Exclusions, []],
      OutsourcedSpecialistOperations: [this.model.OutsourcedSpecialistOperations, [Validators.required, Validators.maxLength( 200 )]],
      ConsultancyRelatingDetails: [this.model.ConsultancyRelatingDetails, [Validators.required, Validators.maxLength( 200 )]],
      TotalProductionLinesNumber: [this.model.TotalProductionLinesNumber, [Validators.required, Validators.pattern( Patterns.OnlyNumbers ), Validators.min( 0 )]],
      HACCPStudyTypeAndNumber: [this.model.HACCPStudyTypeAndNumber, [Validators.required, Validators.maxLength( 200 )]],
      RawMaterials: [this.model.RawMaterials, [Validators.required, Validators.maxLength( 200 )]],
      ProductionFloorArea: [this.model.ProductionFloorArea, [Validators.required]],
      OtherProductionLinesInformation: [this.model.OtherProductionLinesInformation, [Validators.required, Validators.maxLength( 200 )]],
      TotalEmployeesNumber: [this.model.TotalEmployeesNumber, [Validators.required, Validators.pattern( Patterns.OnlyNumbers ), Validators.min( 0 )]],
      PermanentEmployeesCount: [this.model.PermanentEmployeesCount, [Validators.required, Validators.pattern( Patterns.OnlyNumbers ), Validators.min( 0)]],
      TemporaryEmployeesCount: [this.model.TemporaryEmployeesCount, [Validators.required, Validators.pattern( Patterns.OnlyNumbers ), Validators.min( 0 )]],
      ShiftNumber: [this.model.ShiftNumber, [Validators.required, Validators.pattern( Patterns.OnlyNumbers ), Validators.min( 0 )]],
      SeasonalProductInformation: [this.model.OtherProductionLinesInformation, [Validators.required, Validators.maxLength( 200 )]],
      GrossAnnualTurnover: [this.model.GrossAnnualTurnover, [Validators.required,Validators.pattern( Patterns.OnlyNumbers ),Validators.min(0)]],
      // Name: [this.model.GrossAnnualTurnover, [Validators.required]],




    }
      //this.form.controls["Name"].disable()
    );
  }
  checkIfNumber(event:any){
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for ( const name in controls ) {
      if ( controls[name].invalid ) {
        invalid.push( name );
      }
    }
    return invalid;
  }
  get controls() {
    return this.form.controls;
  }
  onAreaTypeChaged( type: string ) {
    //alert(type);
    if ( type == "ft" )
      this.ftmarked = true;
    else
      this.ftmarked = false;
  }
  onHaveLocalActivitiesChanged( status ) {
    //alert(status);
    
    this.model.HaveLocalActivities = status;
    let control = this.form.controls["Exclusions"];
    if ( status ) {
      control.setValidators( [Validators.required, Validators.maxLength( 200 )] );
    }
    else {
      control.setValidators( null );
    }
    control.updateValueAndValidity();
    this.form.updateValueAndValidity();

  }



  createAdditionalSiteForm() {
    this.additionalSiteForm = this._formBuilder.group( {
      CompanyName: [null, [Validators.required]],
      CompanyAddress: [null, [Validators.required]],
      Activities: [null, [Validators.required]],
      StaffCount: [null, [Validators.required]],
      DocumentationSimilar: [false, []],
      DocumentationFollowSameSystem: [false, []]
    } );
  }

  addAdditionalSite() {
    let item = new AdditionalSiteCreateViewModel();
    Object.assign( item, this.additionalSiteForm.value );
    this.model.AdditionalSites.push( item );
    this.additionalSiteForm.reset();
  }

  disabledAddAdditionalSite(): boolean {
    return !this.additionalSiteForm.valid;
  }

  resetForm() {
    this._router.navigateByUrl( `/request/certification-required/${this.model.RequestID}` );
    // this.model = new RegularRequestCreateViewModel();
    // this.createForm();
  }
  isValidTypes(): boolean {
    let count = 0;
    this.model.ProductFamilies.forEach( family => {
      family.ProductTypes.forEach( type => {
        if ( type.NameEnglish != '' )
          count++;
      } );
    } );
    return count > 0
  }

  save() {
    if(this.form.valid&&!this.error){
    this.isSaving = true;
    Object.assign( this.model, this.form.value );
    console.log(JSON.stringify(this.model))
    if(this.additionalSiteForm.valid){
      let item = new AdditionalSiteCreateViewModel();
      Object.assign( item, this.additionalSiteForm.value );
      this.model.AdditionalSites.push( item );
    }
    //this.model.PermanentEmployeesCount=2;
    this.model.BusinessConditions = [];
    this.model.TimeScales = [];

    this.businessConditions.filter( x => x.Selected == true ).forEach( item => {
      let businessCondition = new BusinessConditionViewModel();
      businessCondition.BusinessConditionID = item.ID;
      businessCondition.RegularRequestID = this.model.RequestID;
      this.model.BusinessConditions.push( businessCondition );
    } );

    this.timeScales.filter( x => x.Selected == true ).forEach( item => {
      let timeScale = new TimeScaleViewModel();
      timeScale.TimeScaleID = item.ID;
      timeScale.RegularRequestID = this.model.RequestID;
      this.model.TimeScales.push( timeScale );
    } );
    this.model.ProductFamilies.forEach( family => {
      family.NameArabic = family.NameEnglish;
      family.RegularRequestID = this.model.RequestID;
      family.ProductTypes.forEach( type => {
        type.NameArabic = type.NameEnglish;
        type.ProductFamilyID = family.ID
      } );
    } );
    //this.model.ProductFamilies=[];
    this._regularRequestService.post( this.model ).subscribe( response => {
      this.isSaving = true;
      if ( response.Success ) {
        let requestID = response.Data as number;
        //this._alertService.success(response.Message);
        //this._router.navigateByUrl( `/request/operation/${this.model.RequestID}` )
        this._requestService.getEditableSections(this.model.RequestID).subscribe(response=>{
          let sections=response.Data;
          this._requestService.navigateToNextEditableSection(this.model.RequestID,3,sections);
        });
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
  onFilesAdded( files: File[] ) {

    files.forEach( file => {
      const reader = new FileReader();
      // this.files += file.name + '/n';
      reader.onload = ( e: ProgressEvent ) => {
        const content = ( e.target as FileReader ).result;

        // this content string could be used directly as an image source
        // or be uploaded to a webserver via HTTP request.
      };

      // use this for basic text files like .txt or .csv
      reader.readAsText( file );

      // use this for images
      // reader.readAsDataURL(file);
    } );
  }

  onFilesRejected( files: File[] ) {
  }
  onHasAdditionalSiteChanged( status ) {
    this.hasAdditionalSites = status;
    if ( status == false )
      this.model.AdditionalSites = [];
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
              attachment.AttachmentType = AttachmentType.Scope;
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if ( !this.model.ScopeAttachments )
                this.model.ScopeAttachments = [];
              this.model.ScopeAttachments.push( attachment );
              this.isUploading = false;
            }
            this.form.controls['RegistrationScope'].setValidators( null );
            this.form.controls['RegistrationScope'].updateValueAndValidity();
            this.myInputVariable.nativeElement.value = "";
          }
          this.error=false;

        }, null, () => { this.isUploading = false; } );
      }

    }

    else {
      this.isUploading = false;
    }

  }
  removeAttachment( index: number ) {
    this.model.ScopeAttachments.splice( index, 1 );
    if ( this.model.ScopeAttachments.length == 0 )
    {
      this.error=true;
    }
  }
  removeAttachmentRaw( index: number ) {
    this.model.RawMaterialsAttachments.splice( index, 1 );
   
  }
  onFileChangedRaw( event ) {
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
              attachment.AttachmentType = AttachmentType.Scope;
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if ( !this.model.RawMaterialsAttachments )
                this.model.RawMaterialsAttachments = [];
              this.model.RawMaterialsAttachments.push( attachment );
              this.isUploading = false;
            }
   
          }
          this.error=false;

        }, null, () => { this.isUploading = false; } );
      }

    }

    else {
      this.isUploading = false;
    }

  }
  toggleVisibility( e ) {
    this.marked = e.target.checked;
  }

  toggleFtVisibility( e ) {
    this.ftmarked = e.target.checked;
    this.m2marked = !e.target.checked;
  }

  toggleExclusionsVisibility( e, mark ) {
    if ( mark == 'yes' ) {
      this.haveLocalActivities = true;
    }
    else {
      this.haveLocalActivities = false;
    }
  }

  toggleM2Visibility( e ) {
    this.m2marked = e.target.checked;
    this.ftmarked = !e.target.checked;
  }

}
