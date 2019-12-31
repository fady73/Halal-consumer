import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../index/index.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateComplaintComponent } from '../create-complaint/create-complaint.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'index',
    component: IndexComponent
  },

 {
    path: 'create',
    component: CreateComplaintComponent
  }
];

@NgModule({
  declarations: [IndexComponent,CreateComplaintComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDropzoneModule,
    NgxPaginationModule,
    NgbModule,
    NgSelectModule,
   RouterModule.forChild( routes ),
    HttpClientModule
  ]
})
export class ComplaintModule { }
