import { environment } from './../../../environments/environment.prod';
import { RequiredCertificateCreateViewModel } from './certification-required/required-certificate-create.model';
import { RequestDetailsCreateViewModel } from './request-details-create.model';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { SaleCreateViewModel } from './sale/sale-create.model';
import { VisitCostCreateViewModel } from './visit-cost/visit-cost-create.model';
import { OperationCreateViewModel } from './operation/operation-create.model';
import { RequestViewModel } from './request.model';
import { RequestSearchViewModel } from './request-search.model';
import { RequestDocumentViewModel } from './request-document.model';
import { RequestCancelViewModel } from './request-cancel.model';
import { Router } from '@angular/router';
import { AppealModel } from './appeal-model';
import { CommissionCreateViewModel } from './commission-create.model';
import { ProductHalalDetailCreateViewModel } from './product-halal-detail-create-view-model';
import { ProductHalalLogoDetailCreateViewModel } from './product-halal-logo-detail-create-view-model';
import { ModificationModel } from './modification-model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  type: string;
  controller = "request";
  constructor(private apiService: ApiService,
    private _router: Router
  ) { }
  // name: string, brandId: number, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number
  get(searchViewModel: RequestSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number) {
    return this.apiService.get(`/company/GetRequests?orderBy=${orderBy}&pageIndex=${pageIndex}&isAscending=${isAscending}&pageSize=${environment.pageSize}`)
  }

  remove(Id: number) {
    return this.apiService.remove(`/request/delete/${Id}`);
  }

  cancel(item: RequestCancelViewModel) {
    return this.apiService.post(`/request/ConsumerCancelRequest`, item);
  }
  getEditableByID(id: number) {
    return this.apiService.get(`/${this.controller}/GetEditableByID/${id}`);
  }
  getByID(id: number) {
    return this.apiService.get(`/${this.controller}/getByID/${id}`);
  }
  getCompanyThirdPartyCertifications() {
    return this.apiService.get(`/CertificateCompany/Get`);
  }
  getEditableRequiredCertificate(id: number) {
    return this.apiService.get(`/${this.controller}/GetEditableRequiredCertificate?requestID=${id}`)
  }
  POSTRequiredCertificate(viewModel: RequiredCertificateCreateViewModel) {
    return this.apiService.post(`/${this.controller}/POSTRequiredCertificate`, viewModel);
  }
  getCountryList() {
    return this.apiService.get(`/Country/get`)
  }
  getRequestTypeList() {
    return this.apiService.get(`/${this.controller}/GetRequestTypeList`)
  }
  getBusinessConditions() {
    return this.apiService.get(`/BusinessCondition/getList`)
  }
  getTimeScales() {
    return this.apiService.get(`/TimeScale/getList`)
  }
  getCertificateTypeList() {
    return this.apiService.get(`/${this.controller}/GetCertificateTypeList`)
  }

  post(viewModel: RequestDetailsCreateViewModel) {
    return this.apiService.post(`/Request/Post`, viewModel);
  }
  postProductHalalLogo(viewModel: ProductHalalLogoDetailCreateViewModel) {
    return this.apiService.post(`/ProductHalalLogo/POST`, viewModel);
  }

  renew(id: number) {
    return this.apiService.post(`/Request/Renew?requestID=${id} `);
  }
  postDocument(viewModel: RequestDocumentViewModel[]) {
    return this.apiService.post(`/RequestDocument/Post`, viewModel);
  }

  getDocuments(id: number) {
    return this.apiService.get(`/RequestDocument/GetReview?RequestID=${id}`);
  }
  PostSales(viewModel: SaleCreateViewModel) {
    return this.apiService.post(`/RegularRequest/POSTMarketingCountry?RequestID=${viewModel.RequestID}`, viewModel.countriesIDs);
  }

  PostVisitCost(viewModel: VisitCostCreateViewModel) {
    return this.apiService.post(`/Request/POSTVisitCost`, viewModel);
  }

  PostOperations(viewModel: OperationCreateViewModel) {
    return this.apiService.post(`/Request/POSTOperationsDetails`, viewModel);
  }
  getOperationsDetails(id: number) {
    return this.apiService.get(`/${this.controller}/GetOperationsDetails?requestID=${id}`);
  }
  getEditableVisitCost(id: number) {
    return this.apiService.get(`/${this.controller}/GetEditableVisitCost?requestID=${id}`);
  }
  getIsEditableSection(id: number, stepNumber: number) {
    return this.apiService.get(`/${this.controller}/GetIsEditableSection?requestID=${id}&stepNumber=${stepNumber}`);
  }

  getComments(id: number) {
    return this.apiService.get(`/RequestComment/GetRequestComments?requestID=${id}`);
  }
  getRequestPendingComments(id: number) {
    return this.apiService.get(`/RequestComment/GetRequestPendingComments?requestID=${id}`);
  }

  getRequestStep(id: number) {
    return this.apiService.get(`/${this.controller}/GetRequestStep/${id}`);
  }
  getEditableSections(id: number) {
    return this.apiService.get(`/${this.controller}/GetEditableSections/${id}`);
  }
  navigateToNextEditableSection(id: number, currentSectionNumber: number, sections: number[]) {
    sections = sections.filter(x => x > currentSectionNumber);
    if (sections.length == 0 || !sections)
      this._router.navigateByUrl(`/request`);
    else {
      let sectionID: number = sections[0];
      if (localStorage.getItem("type")) {
        this.type = localStorage.getItem("type");
      }
      if (this.type == '0') {
        switch (sectionID) {
          case 1:
            this._router.navigateByUrl(`/request/edit/${id}`);
            break;
          case 2:
            this._router.navigateByUrl(`/request/certification-required/${id}`);
            break;
          case 3:
            this._router.navigateByUrl(`/request/regular-request/${id}`);
            break;
          case 4:
            this._router.navigateByUrl(`/request/operation/${id}`);
            break;
          case 5:
            this._router.navigateByUrl(`/request/sales/${id}`);
            break;

          case 7:
            this._router.navigateByUrl(`/request/appendix-classification/${id}`);
            break;
          case 8:
            this._router.navigateByUrl(`/request/appendix-primary-sector/${id}`);
            break;

        }
      }
      if (this.type == '1') {
        switch (sectionID) {
          case 1:
            this._router.navigateByUrl(`/request/edit/${id}`);
            break;
          case 2:
            this._router.navigateByUrl(`/request/certification-required/${id}`);
            break;
          case 3:
            this._router.navigateByUrl(`/request/recognition-request/${id}`);
            break;
          case 4:
            this._router.navigateByUrl(`/request/operation/${id}`);
            break;
          case 5:
            this._router.navigateByUrl(`/request/appendix-classification/${id}`);
            break;


        }
      }
    }
  }

  getCountriesList() {
    return this.apiService.get(`/Country/GetList`);
  }

  getRequestStatusList() {
    return this.apiService.get(`/${this.controller}/GetRequestStatusList`);
  }

  getCompaniesList() {
    return this.apiService.get(`/company/getList`);
  }

  postappeal(viewModel: AppealModel) {
    return this.apiService.post(`/AppealRequest/POST`, viewModel);
  }


  POSTCommission(model: CommissionCreateViewModel) {
    console.log(model);
    return this.apiService.post(`/CenterCommission/POST`, model);
  }

  postmodification(model: ModificationModel) {
    return this.apiService.post(`/RegularRequest/RequestModification`, model)
  }


  getSuspensionReason(requestID: number) {
    return this.apiService.get(`/${this.controller}/GetSuspensionReason?requestID=${requestID}`);
  }

  getCancelationReason(requestID: number) {
    return this.apiService.get(`/${this.controller}/GetCancelationReason?requestID=${requestID}`);
  }

  getWithdrawlReason(requestID: number) {
    return this.apiService.get(`/${this.controller}/GetWithdrawlReason?requestID=${requestID}`);
  }
}
