import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../request.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Patterns } from 'src/app/shared/common/patterns';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ProductHalalLogoDetailCreateViewModel } from '../product-halal-logo-detail-create-view-model';
import { ProductHalalDetailCreateViewModel } from '../product-halal-detail-create-view-model';
import { ProfilePictureViewModel } from '../../company/profile/change-profile-picture';
import { SelectItem } from 'src/app/shared/view-models/select-view-model';
import { ProductModel } from '../productModel';
import { RegularRequestService } from '../regular-request.service';
import { ProductFamily } from '../regular-request/product-family.model';
import { ProductModelClass } from '../../product-model-class';

@Component({
  selector: 'app-product-halal-logo-request',
  templateUrl: './product-halal-logo-request.component.html',
  styleUrls: ['./product-halal-logo-request.component.css']
})
export class ProductHalalLogoRequestComponent implements OnInit {
  formLogo:FormGroup;
  isEditable=false;
  itemType:SelectItem;
  types: SelectItem[] = [];
   product:ProductModelClass[]=[];
  @ViewChild( 'myInput', { static: false } ) myInputVariable: ElementRef;
  Model:ProductHalalLogoDetailCreateViewModel;
  item:ProductHalalDetailCreateViewModel
  constructor( 
    private _formBuilder: FormBuilder,
    private _requestService: RequestService,
    private _RegularRequestService:RegularRequestService,
    private _alertService: AlertService,
    private _crudService: CrudService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) { 
      this.Model=new ProductHalalLogoDetailCreateViewModel();
      this.item=new ProductHalalDetailCreateViewModel();
      this.item.Attachments=new AttachmentCreateViewModel();
      this.itemType=new SelectItem();
      
    }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe( params => {
     console.log(params.get( 'id' ));
     this.Model.RequestID=+params.get('id');
    });
    this._RegularRequestService.getR(this.Model.RequestID).subscribe(data=>{
      this.product=data.Data["ProductFamilies"];
     this.product.forEach(e=>{
         console.log(e.Name)
         this.itemType.Name=e.Name;
         this.itemType.ID=e.ID;
         this.types.push(this.itemType)
         
      
     })
      console.log(this.product)
    })
    this.createCattleBreedingFrom();
 
  }
  
  createCattleBreedingFrom(){
    this.formLogo=this._formBuilder.group({
      Type:['',[Validators.required]],
      Notes:['',[Validators.required]]
    });
  }


  onFileChanged( event ) {
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
              this.item.Attachments=attachment;

            }
            this.myInputVariable.nativeElement.value = "";
          }
        }, null, () => {  } );
      }
    }

    else {
    }

  }

  removeAttachment(  ) {
    this.item.Attachments=new AttachmentCreateViewModel();
    this.item.Attachments.FilePath="";
    console.log(this.item)

  }
  removeAttachmentImage(){
    this.item.ImageURL="";
    console.log(this.item)
  }
  onFileChangedForImage( event ) {
    console.log(this.item.ImageURL)
    let formData: FormData = new FormData();
    formData.append( 'uploadFile_' + 0, event.target.files[0], event.target.files[0].name );
    this._attachmentService.upload( formData ).subscribe( response => {
      if ( response.Success ) {
        let file = response.Data[0];
        // this.model.ImagePath = file.FilePath;
        this.item.ImageURL=file.FilePath;
        console.log(this.item.ImageURL)

      }
    },
      error => {
        this._alertService.error( " Maximum file size is 2 MB" );
      }
      , () => {  } );

  }

  removeLastCattleBreedings() {

    this.formLogo.reset();
  }
  removeCattleBreedings( familyIndex: number ) {
      this.Model.Details.splice( familyIndex, 1 );
  }
  addCattleBreeding(){
    if(this.formLogo.valid)
    {
      let cattleBreeding=this.formLogo.value;
      console.log(cattleBreeding)
      this.item.Notes=this.formLogo.value.Notes;
      this.item.ProductHalalLogoID=this.formLogo.value.Type;
      console.log(this.item.ProductHalalLogoID)
      this.product.forEach(e=>{
        if(e.ID==this.item.ProductHalalLogoID)
        {
          e.ProductTypes.forEach(element => {
            this.item.ProductTypeID=element.ID;
          });
        }
      })

      this.Model.Details.push(this.item)
      this.item=new ProductHalalDetailCreateViewModel();
      this.Model.Details[0].Notes
      this.item.ImageURL="";
      this.item.Attachments=new AttachmentCreateViewModel();
      console.log(this.Model);
      this.formLogo.reset();

    }
    
  }
  post(){
    if(this.formLogo.valid)
    {
    this.addCattleBreeding();
    this._requestService.postProductHalalLogo(this.Model).subscribe(response=>{
        this._router.navigateByUrl(`/request`)
     });
    }
      
    }
  

}
