import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreateDetailsComponent } from './create-details/create-details.component';
import { CertificationRequiredComponent } from './certification-required/certification-required.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { SaleComponent } from './sale/sale.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VisitCostComponent } from './visit-cost/visit-cost.component';
import { OperationComponent } from './operation/operation.component';
import { RegularRequestComponent } from './regular-request/regular-request.component';
import { RecognitionRequestComponent } from './recognition-request/recognition-request.component';
import { SectionsStepsComponent } from './sections-steps/sections-steps.component';
import { SuccessComponent } from './success/success.component';
import { AppendixClassificationComponent } from './appendix-classification/appendix-classification.component';
import { AppendixPrimarySectorComponent } from './appendix-primary-sector/appendix-primary-sector.component';
import { CommentsComponent } from './comments/comments.component';
import { RequestDocumentsComponent } from './request-documents/request-documents.component';
import { TooltipModule } from 'ngx-bootstrap';
import { AppealComponent } from './appeal/appeal.component';
import { ProductHalalLogoRequestComponent } from './product-halal-logo-request/product-halal-logo-request.component';
import { RecognitionRequestModificationComponent } from './recognition-request-modification/recognition-request-modification.component';
import { ModificationBodyCertificationComponent } from './modification-body-certification/modification-body-certification.component';
import { ProductCertificateComponent } from './product-certificate/product-certificate.component';


const routes: Routes = [

  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'edit/:id',
    component: CreateDetailsComponent
  },
  {
    path: 'create',
    component: CreateDetailsComponent
  },
  {
    path: 'edit/:id',
    component: CreateDetailsComponent
  },
  {
    path: 'success',
    component: SuccessComponent
  },
  {
    path: 'certification-required/:id',
    component: CertificationRequiredComponent
  },

  {
    path: 'sales/:id',
    component: SaleComponent
  },
  {
    path: 'visit-cost/:id',
    component: VisitCostComponent
  },
  {
    path: 'operation/:id',
    component: OperationComponent
  }
  ,
  {
    path: 'regular-request/:id',
    component: RegularRequestComponent
  }
  ,
  {
    path: 'recognition-request/:id',
    component: RecognitionRequestComponent
  },{
    path: 'recognition-request-modification/:id',
    component: RecognitionRequestModificationComponent
  },
  {
    path: 'appendix-classification/:id',
    component: AppendixClassificationComponent
  }
  ,
  {
    path: 'appendix-primary-sector/:id',
    component: AppendixPrimarySectorComponent
  },
  {
    path: 'request-documents/:id',
    component: RequestDocumentsComponent
  },
  {
    path: 'appeal/:id',
    component: AppealComponent
  },
  {
    path: 'logorequest/:id',
    component: ProductHalalLogoRequestComponent
  },
  
  {
    path: 'modification-certification/:id',
    component: ModificationBodyCertificationComponent
  },
  {
    path: 'product-certificate/:id',
    component: ProductCertificateComponent
  }

];

@NgModule( {
  imports: [
    SharedModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
    NgxPaginationModule,
    NgSelectModule,
    TooltipModule.forRoot(),
    CommonModule, RouterModule.forChild( routes ),
    HttpClientModule
  ],
  declarations: [IndexComponent, AppendixPrimarySectorComponent, RequestDocumentsComponent, AppendixClassificationComponent, SuccessComponent, RecognitionRequestComponent,RecognitionRequestModificationComponent, OperationComponent, RegularRequestComponent, VisitCostComponent, SaleComponent, CertificationRequiredComponent, CreateDetailsComponent, CreateComponent, CertificationRequiredComponent, SectionsStepsComponent, AppendixClassificationComponent, AppendixPrimarySectorComponent, CommentsComponent, AppealComponent, ProductHalalLogoRequestComponent, ModificationBodyCertificationComponent, ProductCertificateComponent]
} )

export class RequestModule { }
