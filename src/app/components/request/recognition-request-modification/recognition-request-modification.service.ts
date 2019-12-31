import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ProductCategoryViewModel } from '../appendix-classification/product-category.model';
import { RecognitionRequestModificationModel } from './recognition-request-modification-model';

@Injectable({
  providedIn: 'root'
})
export class RecognitionRequestModificationService {

  controller="RecognitionRequest";
  constructor(private apiServise:ApiService) { }
  getProductCategories(){
    return this.apiServise.get("/productCategory/get");
  }
  getAppendixI(id:number)
  {
    return this.apiServise.get(`/request/getAppendixI?requestID=${id}`);
  }
  post(body:RecognitionRequestModificationModel)
  {
    return this.apiServise.post(`/${this.controller}/RequestModification?`,body);
  }
}
