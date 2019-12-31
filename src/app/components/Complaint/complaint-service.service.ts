import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ComplaintUploadModel } from './complaint-upload-model';
import { ComplaintModel } from './complaint-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintServiceService {

  
  controller = "Complaint";
  constructor( private apiService: ApiService ) { }
  get() {
    // return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}&companyID=${searchViewModel.CompanyID}&countryID=${searchViewModel.CountryID}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=environment.pageSize` );
    return this.apiService.get( `/${this.controller}/GetLoggedCompanyComplaints` );
  }
  geto( orderBy: string, isAscending: boolean, pageIndex: number ) {
    return this.apiService.get( `/${this.controller}/GetLoggedCompanyComplaints?orderBy=${orderBy}&pageIndex=${pageIndex}&isAscending=${isAscending}&pageSize=${environment.pageSize}` )
  }

  post( viewModel: ComplaintModel ) {
    return this.apiService.post( `/Complaint/Post`, viewModel );
  }

}
 