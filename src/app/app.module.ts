import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './shared/alert/alert.component';
import { SharedModule } from './shared/module/shared.module';
import { HeaderComponent } from './shared/header/header.component';
import { LayoutHomeComponent } from './shared/layout-home/layout-home.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IntlInputPhoneModule } from 'intl-input-phone';
// import { StepComponent } from './components/modification-body-certification/step/step.component';



export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, 'assets/i18n/', '.json' );
}
@NgModule( {
  declarations: [
    AppComponent,
    LayoutComponent,
    LayoutHomeComponent,
    HomeComponent,
    PageNotFoundComponent, AlertComponent,
    //  StepComponent

  ],
  imports: [
    IntlInputPhoneModule,
    BrowserModule, AppRoutingModule, SharedModule,
    NgbModule,
    TranslateModule.forRoot( {
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    } ),

    NgProgressModule.withConfig( {
      direction: "rtl+",
      spinnerPosition: 'left',
      color: '#1372ae'
    } ),
    NgProgressHttpModule
    , BrowserAnimationsModule, ModalModule.forRoot(), TooltipModule.forRoot()
  ],

  providers: [TranslateService],
  bootstrap: [AppComponent]
} )
export class AppModule { }
