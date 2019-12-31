import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppendixClassificationService } from './appendix-classification.service';
import { ProductCategoryViewModel } from './product-category.model';
import { forkJoin } from 'rxjs';
import { RequestAppendixIViewModel } from './request-appendixI.model';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-appendix-classification',
  templateUrl: './appendix-classification.component.html',
  // styleUrls: ['./appendix-classification.component.css']
})
export class AppendixClassificationComponent implements OnInit {

  id:number=0;
  isPageLoaded:boolean=false;
  items:ProductCategoryViewModel[]=[];
  isEditable=false;
  selectedCategories:RequestAppendixIViewModel[]=[];
  type: string;
  constructor(
    private _activatedRoute:ActivatedRoute,
    private _requestService:RequestService,
    private _router:Router
    ,private _appendixClassificationService:AppendixClassificationService
    
    ) { }

  ngOnInit() {
this.initializePage();
   
  }
  initializePage() {

    this._activatedRoute.paramMap.subscribe(params => {
      this.id = +params.get('id');
      forkJoin([
        this._appendixClassificationService.getProductCategories(),
        this._appendixClassificationService.getAppendixI(this.id),
        this._requestService.getIsEditableSection(this.id,7)


      ]).subscribe(res=>{
        this.items=res[0].Data.Result;
  
        this.selectedCategories=res[1].Data;
        this.isEditable=res[2].Data;
        this.items.forEach(item=>{
          item.IsSelected=this.selectedCategories&&this.selectedCategories.some(x=>x.ProductCategoryID==item.ID);
        });
        this.isPageLoaded=true;
      });
    });
  }
  changeStatus(category:ProductCategoryViewModel){
category.IsSelected=!category.IsSelected;
//alert(category.IsSelected);
  }
  resetForm() {
    if (localStorage.getItem("type")) {
      this.type=localStorage.getItem("type");
    }
    if(this.type=="1")
    this._router.navigateByUrl(`/request/operation/${this.id}`);
    if(this.type=="0")

    this._router.navigateByUrl(`/request/sales/${this.id}`);
  }
  error:boolean=false;
  post(){
    //alert("post");
    let categories=this.items.filter(x=>x.IsSelected);
    if(categories.length>0)
    {
      //alert(categories.length);
      this._appendixClassificationService.post(this.id,categories).subscribe(response=>{
this._requestService.getEditableSections(this.id).subscribe(response=>{
  let sections=response.Data;
  if (localStorage.getItem("type")) {
    this.type=localStorage.getItem("type");
  }
  if(this.type=='0')
  this._requestService.navigateToNextEditableSection(this.id,7,sections);
  if(this.type=='1')
  this._router.navigateByUrl(`/request`)
});
//this._router.navigateByUrl(`/request/appendix-primary-sector/${this.id}`);

      });
    }
    else{
      this.error=true;
    }
    
  }

}
