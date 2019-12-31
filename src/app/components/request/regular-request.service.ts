import { RequiredCertificateCreateViewModel } from './certification-required/required-certificate-create.model';
import { RequestDetailsCreateViewModel } from './request-details-create.model';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RegularRequestCreateViewModel } from './regular-request/regular-request-create.model';

@Injectable({
  providedIn: 'root'
})
export class RegularRequestService {

  controller="RegularRequest";
  constructor(private apiService: ApiService) { }
  // name: string, brandId: number, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number
  get() {
    return this.apiService.get(`/company/GetRequests`)
  }


  getProductionFloorAreaInMeterList() {
    return this.apiService.get(`/${this.controller}/GetProductionFloorAreaInMeterList`)
  }
  getProductionFloorAreaInFeetList() {
    return this.apiService.get(`/${this.controller}/GetProductionFloorAreaInFeetList`)
  }
  getEditableByID(id:number) {
    return this.apiService.get(`/${this.controller}/GetEditableByID/${id}`);
  }
  getR(id:number) {
    return this.apiService.get(`/RegularRequest/GetByID/${id}`);
  }
  getMarketingCountry(id:number) {
    return this.apiService.get(`/${this.controller}/GetMarketingCountry?regularRequestID=${id}`);
  }
  

  
  
  getBusinessConditions(){
    return this.apiService.get(`/BusinessCondition/getList`)
  }
  getTimeScales(){
    return this.apiService.get(`/TimeScale/getList`)
  }

  
  post(viewModel:RegularRequestCreateViewModel) {
   // if(viewModel.ID==0)
      return this.apiService.post(`/${this.controller}/Post`,viewModel);
  // else
  //   return this.apiService.post(`/${this.controller}/put`,viewModel);

    }

}
