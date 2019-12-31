import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductCategoryViewModel } from '../appendix-classification/product-category.model';
import { ProductCertificateModel } from './product-certificate-model';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../request.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ProductCertificateService } from './product-certificate.service';
import { DetailsModel } from './details-model';
import { forkJoin } from 'rxjs';
import { RequestAppendixIViewModel } from '../appendix-classification/request-appendixI.model';

@Component({
  selector: 'app-product-certificate',
  templateUrl: './product-certificate.component.html',
  styleUrls: ['./product-certificate.component.css']
})
export class ProductCertificateComponent implements OnInit {


  id: number = 0;
  isPageLoaded: boolean = false;
  items: ProductCategoryViewModel[] = [];
  productid:number[]=[];
  isEditable = true;
  selectedCategories: RequestAppendixIViewModel[] = [];
  type: string;
  error: boolean = false;
  model: ProductCertificateModel = new ProductCertificateModel();
  isUploading = false;
  disableSubmit = false;
  detailarr:DetailsModel[]=[];

  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private _alertService: AlertService,
    private _router: Router
    , private _productCertificate: ProductCertificateService

  ) { }

  ngOnInit() {
    this.initializePage();
  }
  initializePage() {

    this._activatedRoute.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.model.RequestID = this.id;
      forkJoin([
        this._productCertificate.getProductCategories(),
         this._productCertificate.getAppendixI(this.id),
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





  post() {
    this.items.forEach(item => {
      if (item.IsSelected)
        this.productid.push(item.ID);
    });
    console.log(this.productid);
    //return;
    if (this.productid.length > 0) {
      
      for(var i=0;i<this.productid.length;i++)
      {
        let detail:DetailsModel=new DetailsModel();
        detail.ProductTypeID=this.productid[i];
        detail.Cost=1;
        // detail.ID=0;
        // detail.ProductCertificateID=0;
        this.model.Details.push(detail);
      }
      console.log(this.model)
           //alert(categories.length);
      this._productCertificate.post(this.model).subscribe(response => {
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
