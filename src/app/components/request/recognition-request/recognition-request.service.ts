import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RecognitionRequestCreateViewMode } from './recognition-request-create.model';

@Injectable({
  providedIn: 'root'
})
export class RecognitionRequestService {

  controller = "RecognitionRequest";
  constructor(private apiService: ApiService) { }
  // name: string, brandId: number, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number
  get() {
    return this.apiService.get(`/company/GetRequests`)
  }
  getEditableByID(id:number) {
    return this.apiService.get(`/${this.controller}/getEditableByID/${id}`);
  }
  
  post(viewModel: RecognitionRequestCreateViewMode) {
    return this.apiService.post(`/${this.controller}/Post`, viewModel);
  }
 
  getComments( id: number ) {
    return this.apiService.get( `/RequestComment/GetRequestComments?requestID=${id}` );
  }
  
  GetCertificateCountry( id: number ) {
    return this.apiService.get(`/${this.controller}/GetCertificateCountry?regularRequestID=${id}` );
  }
  

}
