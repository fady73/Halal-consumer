import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { UploadComponent } from './upload/upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },
  { path: 'view/:id', component: ViewComponent },
  { path: 'upload/:id', component: UploadComponent }

];
@NgModule( {
  declarations: [IndexComponent, CreateComponent, UploadComponent, ViewComponent],
  imports: [
    CommonModule, RouterModule.forChild( routes ), SharedModule, FormsModule, ReactiveFormsModule
  ]
} )
export class AgreementModule { }
