import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { AgreementUploadViewModel } from './agreement-upload.model';


@Injectable( {
  providedIn: 'root'
} )
export class AgreementService {

  controller = "ServiceAgreement";
  constructor( private apiService: ApiService ) { }

  get( forStaff: boolean = false, orderBy: string = "ID", isAscending: boolean = false, pageIndex: number = 1000 ) {
    // return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}&companyID=${searchViewModel.CompanyID}&countryID=${searchViewModel.CountryID}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=environment.pageSize` );
    return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}` );
  }
  uploadConsumerFinancialOffer( viewModel: AgreementUploadViewModel ) {
    return this.apiService.post( `/${this.controller}/UploadConsumerFinancialOffer`, viewModel );
  }

  getById( Id: number ) {
   
    return this.apiService.get( `/${this.controller}/GetByID/${Id}` );
  }


}
