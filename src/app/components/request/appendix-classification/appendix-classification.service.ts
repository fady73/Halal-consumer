import { ProductCategoryViewModel } from './product-category.model';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AppendixClassificationService {

  controller="request";
  constructor(private apiServise:ApiService) { }
  getProductCategories(){
    return this.apiServise.get("/productCategory/get");
  }
  getAppendixI(id:number)
  {
    return this.apiServise.get(`/${this.controller}/getAppendixI?requestID=${id}`);
  }
  post(id:number,categories:ProductCategoryViewModel[])
  {
    let IDs:number[]=[];
    categories.forEach(category=>{
      IDs.push(category.ID);
    });
    return this.apiServise.post(`/${this.controller}/POSTAppendixI?requestID=${id}`,IDs);
  }
}
