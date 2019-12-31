import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../services/localization.service';
import { BsModalService } from 'ngx-bootstrap';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { FooterComponent } from '../footer/footer.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, 'assets/i18n/', '.json' );
}

@NgModule( {
  declarations: [HeaderComponent,FooterComponent,SideMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxDropzoneModule,
    NgSelectModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forChild( {
      loader: {
        provide: TranslateLoader,
        useFactory: ( HttpLoaderFactory ),
        deps: [HttpClient]
      }, isolate: true
    } )

  ],
  exports: [FormsModule, BsDatepickerModule, ReactiveFormsModule, NgSelectModule, HttpClientModule, NgxDropzoneModule,
    SimpleNotificationsModule, HeaderComponent, FooterComponent, TranslateModule ,SideMenuComponent
  ],

  providers: [NotificationsService]
} )
export class SharedModule {
  constructor( private translate: TranslateService, private localizationService: LocalizationService ) {
    this.translate.use( localizationService.getLanguage() );
  }
}
