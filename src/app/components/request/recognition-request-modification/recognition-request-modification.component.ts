import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RecognitionRequestModificationService } from './recognition-request-modification.service';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { ProductCategoryViewModel } from '../appendix-classification/product-category.model';
import { RequestAppendixIViewModel } from '../appendix-classification/request-appendixI.model';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { RecognitionRequestModificationModel } from './recognition-request-modification-model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentType } from 'src/app/shared/enum/attachment-type';

@Component({
  selector: 'recognition-request-modification',
  templateUrl: './recognition-request-modification.component.html',
  // styleUrls: ['./appendix-classification.component.css']
})
export class RecognitionRequestModificationComponent implements OnInit {

  id: number = 0;
  isPageLoaded: boolean = false;
  items: ProductCategoryViewModel[] = [];
  isEditable = true;
  selectedCategories: RequestAppendixIViewModel[] = [];
  type: string;
  error: boolean = false;
  model: RecognitionRequestModificationModel = new RecognitionRequestModificationModel();
  isUploading = false;
  disableSubmit = false;

  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private _alertService: AlertService,
    private _router: Router
    , private _recognitionRequestModificationService: RecognitionRequestModificationService

  ) { }

  ngOnInit() {
    this.initializePage();
  }
  initializePage() {

    this._activatedRoute.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.model.RequestID = this.id;
      forkJoin([
        this._recognitionRequestModificationService.getProductCategories(),
        this._recognitionRequestModificationService.getAppendixI(this.id),
        //this._requestService.getIsEditableSection(this.id, 7)
      ]).subscribe(res => {
        this.items = res[0].Data.Result;
        this.selectedCategories = res[1].Data;
        //this.isEditable = res[2].Data;
        this.items.forEach(item => {
          item.IsSelected = this.selectedCategories && this.selectedCategories.some(x => x.ProductCategoryID == item.ID);
        });
        if (this.items.filter(c => c.IsSelected).length == 0) {
          this.disableSubmit = true;
        }
        this.isPageLoaded = true;
      });
    });
  }
  changeStatus(category: ProductCategoryViewModel) {
    category.IsSelected = !category.IsSelected;
    if (this.items.filter(c => c.IsSelected).length == 0) {
      this.disableSubmit = true;
    }else{
      this.disableSubmit = false;

    }
    console.log(this.items.filter(c => c.IsSelected).length);
    //alert(category.IsSelected);
  }




  onFileChanged(event) {
    this.isUploading = true;
    let isAllawableExt = true;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const formData: FormData = new FormData();
      for (let index = 0; index < fileList.length; index++) {
        const file: File = fileList[index];

        let ext = file.name.split('.')[1];

        if (ext != 'pdf' && ext != 'docx' && ext != 'doc') {
          isAllawableExt = false;
        } else {
          formData.append('uploadFile_' + index, file, file.name);
        }
      }
      if (isAllawableExt == false) {
        this._alertService.error('Only allawable files are pdf , doc , docx');
        this.myInputVariable.nativeElement.value = '';
      } else {
        this._attachmentService.upload(formData).subscribe(response => {
          if (response.Success) {
            const files: UploadFile[] = response.Data;

            for (let index = 0; index < files.length; index++) {
              const item = files[index];
              const attachment = new AttachmentCreateViewModel();
              attachment.AttachmentType = 24;
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if (!this.model.Attachments) {
                this.model.Attachments = [];
              }
              this.model.Attachments.push(attachment);
              this.isUploading = false;
            }

            this.myInputVariable.nativeElement.value = '';
          }
          this.error = false;

        }, null, () => { this.isUploading = false; });
      }

    } else {
      this.isUploading = false;
    }

  }
  removeAttachment(index: number) {
    this.model.Attachments.splice(index, 1);
    if (this.model.Attachments.length == 0) {
      //this.error = true;
    }
  }




  post() {
    this.items.forEach(item => {
      if (item.IsSelected)
        this.model.ProductCategoriesIDs.push(item.ID);
    });
    console.log(this.model);
    //return;
    if (this.model.ProductCategoriesIDs.length > 0) {
      //alert(categories.length);
      this._recognitionRequestModificationService.post(this.model).subscribe(response => {
        if (response.Success) {
          this._alertService.success(response.Message, true);
          this._router.navigateByUrl(`/request`);
        } else {
          this._alertService.error(response.Message, true);
        }
      });
    }
    else {
      this.error = true;
    }
  }

}
