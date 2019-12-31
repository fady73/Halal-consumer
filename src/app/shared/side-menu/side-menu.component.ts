import { CompanyModel } from './../../components/company/company.model';
import { Router } from '@angular/router';
import { UserService } from './../../user/user.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import { LocalizationService } from '../services/localization.service';
import { CompanyService } from '../services/company.service';
import { NotificationService } from '../layout/notification.service';
// import {Notification} from '../../shared/layout/notification'


@Component( {
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
} )
export class SideMenuComponent implements OnInit {
  logged: boolean = false;
  profileImage:string;
  company: CompanyModel;
 
  // NotificationLength:number=0;

  // Notification: Notification[] = [];
  constructor(
    private _userService: UserService,
    private _companyService: CompanyService,
    private localizationService: LocalizationService,
    private _notification: NotificationService,
    private _router: Router
  ) { }
  ngOnInit() {
    this._userService.getProfilePicture().subscribe(response=>{
      this.profileImage=response.Data;
    });

    // this._notification.change.subscribe(isOpen => {
    //   this.NotificationLength = isOpen;
    // });


    
    this.getCompanyDetails();
    this._userService.getLoggedStatus().subscribe( response => {
      this.logged = response;
    } )

    // this._notification.GetNotification().subscribe( data => {
    //   this.Notification = data.Data;
    //   this.Notification.forEach((item) => {
    //     if(item.Seen==false)
    //     {
    //       this.NotificationLength++;

    //     }

    //   })


    // } )
    

  }

  getCompanyDetails() {
    this._companyService.getLoggedCompany().subscribe( response => {
      this.company = response.Data;
    } );
  }

}
