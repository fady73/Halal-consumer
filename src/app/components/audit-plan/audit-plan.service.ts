import { ApiService } from './../../shared/services/api.service';
import { Injectable } from '@angular/core';
import { AuditPlanSearchViewModel } from './audit-plan-search.model';
import { AuditPlanViewModel } from './audit-plan.model';
import { RequestModificationCreateViewModel } from './request-modification-create.model';
import { AuditPlanUploadViewModel } from './audit-plan-upload.model';

@Injectable( { providedIn: 'root' } )
export class AuditPlanService {

  controller = 'AuditPlan';
  constructor( private apiService: ApiService ) { }


  get( forStaff: boolean = false ) {
    // return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}&companyID=${searchViewModel.CompanyID}&countryID=${searchViewModel.CountryID}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=environment.pageSize` );
    return this.apiService.get( `/${this.controller}/get?forStaff=${forStaff}` );
  }


  getById( Id: number ) {
    return this.apiService.get( `/${this.controller}/GetByID/${Id}` );
  }
  getByRequestID( requestID: number, version: number = null ) {
    return this.apiService.get( `/${this.controller}/GetByRequestID?requestID=${requestID}&version=${version}` );
  }
  getAllVersions( requestID: number ) {
    return this.apiService.get( `/${this.controller}/GetAllVersions?requestID=${requestID}` );
  }


  uploadCorrectivePlan( body: AuditPlanUploadViewModel ) {
    return this.apiService.post( `/NCR/POSTUploadCorrectivePlan`, body );
  }

  approved( item: AuditPlanViewModel ) {

    return this.apiService.post( `/${this.controller}/ConfirmAuditPlanByConsumer?auditPlanID=${item.ID}`, item );
  }
  saveModification( item: RequestModificationCreateViewModel ) {
    return this.apiService.post( `/${this.controller}/POSTRequestModification`, item );
  }

  decline( item: AuditPlanViewModel ) {
    return this.apiService.post( `/${this.controller}/DeclineAuditPlan?AuditPlanID=${item.ID}`, item );
  }
}