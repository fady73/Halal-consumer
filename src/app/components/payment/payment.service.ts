import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { PaymentUploadViewModel } from './payment-upload.model';
import { RequestSearchViewModel } from '../request/request-search.model';


@Injectable( {
  providedIn: 'root'
} )
export class PaymentService {

  controller = "RequestPayment";
  constructor( private apiService: ApiService ) { }
  get( forStaff: boolean = false, orderBy: string="ID", isAscending: boolean=false, pageIndex: number=1000 ) {
    // return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}&companyID=${searchViewModel.CompanyID}&countryID=${searchViewModel.CountryID}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=environment.pageSize` );
    return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}` );
  }
 
  post( viewModel: PaymentUploadViewModel ) {
    return this.apiService.post( `/RequestPayment/Post`, viewModel );
  }


}
