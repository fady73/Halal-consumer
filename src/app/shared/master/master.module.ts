import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MasterComponent } from './master.component';
import { SharedModule } from '../module/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule, RouterModule.forChild(routes),
    HttpClientModule
  ],
  declarations: [MasterComponent]
})
export class MasterModule { }
