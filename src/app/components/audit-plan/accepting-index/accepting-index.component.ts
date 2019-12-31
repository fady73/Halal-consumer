import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NcrService } from '../ncr.service';
import { NCRViewModel } from '../ncr/ncr.model';
import { AuditPlanService } from '../audit-plan.service';
import { AuditPlanViewModel } from '../audit-plan.model';
import { NCSCABAcceptanceCreateViewModel } from '../ncr/ncs-cap-acceptance-create';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component( {
  selector: 'app-accepting-index',
  templateUrl: './accepting-index.component.html',
  styleUrls: ['./accepting-index.component.css']
} )
export class AcceptingIndexComponent implements OnInit {
  isPageLoaded: boolean = false;
  model: NCRViewModel = new NCRViewModel();
  RequestID: number = 0;
  auditPlan: AuditPlanViewModel = new AuditPlanViewModel();
  constructor( private _NcrService: NcrService,
    private _auditPlanService: AuditPlanService,
    private _crudService: CrudService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {

  }

  ngOnInit() {
    
    this._activatedRoute.paramMap.subscribe( params => {
      this.model.RequestID = +params.get( 'id' );
      this.RequestID = this.model.RequestID;
      this.GetByRequestID( this.model.RequestID );
      //this.getAuditPlan(this.model.AuditPlanID);
    } );
    console.log(JSON.stringify(this.model))

  }
  getAuditPlan( id: number ) {
    this._auditPlanService.getById( id ).subscribe( resposne => {
      this.auditPlan = resposne.Data;
    } );
  }
  GetByRequestID( id: number ) {
    this._NcrService.getByRequestID( this.model.RequestID ).subscribe( response => {
      this.model = response.Data;
      console.log(JSON.stringify(this.model))

      if ( !this.model.NCSs )
        this.model.NCSs = [];
      this.model.NCSs.forEach( item => {
        item.CABAcceptance = false;
      } );
      this.isPageLoaded = true;
    } );
  }
  save() {
    

    let ncs: NCSCABAcceptanceCreateViewModel[] = [];
    this.model.NCSs.forEach( item => {
      ncs.push( { NCSID: item.ID, CABAcceptance: item.CABAcceptance } );
    } );
    this._NcrService.POSTNCSCABAcceptance( ncs ).subscribe( response => {
      if ( response.Success ) {
        this._crudService.alert.success( response.Message );
        this._router.navigateByUrl( `/audit-plan/accepting-corrective/${this.RequestID}` );
      }
      else {
        this._router.navigateByUrl("/request");
        //this._crudService.alert.error( response.Message );
      }
      //alert(ncs.filter(x=>x.CABAcceptance==false).length);
      
      


    } );
  }

}
