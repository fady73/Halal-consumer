import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ProductCertificateModel } from './product-certificate-model';

@Injectable({
  providedIn: 'root'
})
export class ProductCertificateService {

  constructor(private apiServise:ApiService) { }

  post(body:ProductCertificateModel)
  {
    return this.apiServise.post(`/RegularRequest/POSTProductCertificates`,body);
  }
  getProductCategories(){
    return this.apiServise.get("/productCategory/get");
  }
  getAppendixI(id:number)
  {
    return this.apiServise.get(`/request/getAppendixI?requestID=${id}`);
  }
}
