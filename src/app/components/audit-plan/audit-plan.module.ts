import { ViewComponent } from './view/view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { UploadCorrectiveComponent } from './upload-corrective/upload-corrective.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcceptingIndexComponent } from './accepting-index/accepting-index.component';
import { AcceptingCorrectiveActionComponent } from './accepting-corrective-action/accepting-corrective-action.component';
import { AcceptingSuppliedDocumentComponent } from './accepting-supplied-document/accepting-supplied-document.component';
import { AcceptingUploadDocumentComponent } from './accepting-upload-document/accepting-upload-document.component';
import { TooltipModule } from 'ngx-bootstrap';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'view/:id', component: ViewComponent },
  { path: 'accepting-index/:id', component: AcceptingIndexComponent },
  { path: 'accepting-corrective/:id', component: AcceptingCorrectiveActionComponent },
  { path: 'accepting-supplied/:id', component: AcceptingSuppliedDocumentComponent },
  { path: 'accepting-upload', component: AcceptingUploadDocumentComponent },
  { path: 'upload/:id', component: UploadCorrectiveComponent }


];

@NgModule( {
  declarations: [IndexComponent, ViewComponent, UploadCorrectiveComponent, AcceptingIndexComponent, AcceptingCorrectiveActionComponent, AcceptingSuppliedDocumentComponent, AcceptingUploadDocumentComponent],
  imports: [
    CommonModule,    TooltipModule.forRoot(),
    RouterModule.forChild( routes ), SharedModule, FormsModule, ReactiveFormsModule
  ]
} )
export class AuditPlanModule { }
