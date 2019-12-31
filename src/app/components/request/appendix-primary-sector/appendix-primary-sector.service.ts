import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RegularRequestCreateViewModel } from '../regular-request/regular-request-create.model';

@Injectable({
  providedIn: 'root'
})
export class AppendixPrimarySectorService {

  controller="request";
  constructor(private apiServise:ApiService) { }
  getProductCategories(){
    return this.apiServise.get("/productCategory/get");
  }
  getAppendixI(id:number)
  {
    return this.apiServise.get(`/${this.controller}/getAppendixI?requestID=${id}`);
  }
  post(viewModel:RegularRequestCreateViewModel)
  {
    return this.apiServise.post(`/RegularRequest/POSTAppendiIIx`,viewModel);
  }
  
  
}
