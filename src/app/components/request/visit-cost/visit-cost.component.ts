import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerViewModel } from '../../consumer/consumer-model';
import { AlertService } from '../../../shared/alert/alert.service';
import { CompanyService } from '../../../shared/services/company.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Patterns } from 'src/app/shared/common/patterns';
import { forkJoin } from 'rxjs';
import { RequestService } from '../request.service';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { VisitCostCreateViewModel } from './visit-cost-create.model';

@Component({
  selector: 'app-visit-cost',
  templateUrl: './visit-cost.component.html',
})

export class VisitCostComponent implements OnInit {
  model: VisitCostCreateViewModel = new VisitCostCreateViewModel();
  isPageLoaded = false;
  isSaving = false;
  canEdit=false;
  edit:boolean;
  constructor(
    private _formBuilder: FormBuilder,
    private _companyService: CompanyService,
    private _alertService: AlertService,
    private _requestService: RequestService,
    private _attachmentService: AttachmentService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router

  ) { }

  ngOnInit() {
    this.initializePage();
  }


  initializePage() {
    this._activatedRoute.paramMap.subscribe(params => {
      this.model.RequestID = +params.get('id');
      forkJoin([
        this._requestService.getEditableVisitCost(this.model.RequestID),
        this._requestService.getIsEditableSection(this.model.RequestID,6)

      ]).subscribe(res => {
        this.model = res[0].Data;
        this.canEdit = res[1].Data;
        this.isPageLoaded = true;
        
      });
    })
  }
 
  toggleVisitCost(value) {
    this.model.VisitCost = value;
  }

  resetForm() {
    this._router.navigateByUrl(`/request/sales/${this.model.RequestID}`)
  }
  save() {
    this.isSaving = true;
    this._requestService.PostVisitCost(this.model).subscribe(response => {
      this.isSaving = true;
      if (response.Success) {
        let requestID = response.Data as number;
        //this._alertService.success(response.Message);
        
        this._requestService.getEditableSections(this.model.RequestID).subscribe(response=>{
          let sections=response.Data;
          this._requestService.navigateToNextEditableSection(this.model.RequestID,6,sections);
        });
        //this._router.navigateByUrl(`/request/appendix-classification/${this.model.RequestID}`);

        ///request/appendix-classification/41
        //this._router.navigateByUrl(`/request/success`)
      }
      else {
        this._alertService.error(response.Message);
      }
    }, () => {
      this.isSaving = false;
    });
  }
}
