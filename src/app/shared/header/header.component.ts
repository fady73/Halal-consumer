import { Router } from '@angular/router';
import { UserService } from './../../user/user.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { LocalizationService } from '../services/localization.service';
import { CompanyService } from '../services/company.service';
import { CompanyModel } from 'src/app/components/company/company.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../layout/notification.service';
import {Notification} from '../../shared/layout/notification'
import 'hijri-date';
import HijriDate from 'hijri-date/lib/safe';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  logged: boolean = false;
    company: CompanyModel;
    name:string="";
    profileImage:string;
    Notification:Notification[]=[];
  NotificationLength: number=0;
  date:string="";
  hijriMonth:string[]=[
    "محرم" , "صفر" ,"ربيع الأول" ," ربيع الثاني" ,
" جمادي الأول" ," جمادي الثاني" ,"رجب" ,"شعبان" ,
 "رمضان" , "شوال" ," ذو القعدة" ," ذو الحجة" ,];
 Gorgian:string[]=[
  "يناير" ,
   "فبراير" 
   ," مارس" ,
   "  أبريل" ,
"  مايو" ,
"  يونيو" ,
"يوليو" ,
"أغسطس" ,
"سبتمبر" ,
 "أكتوبر" ,
 " نوفمبر " ,
 "  ديسمبر" 
];
  constructor(
    private _userService: UserService,
        private _companyService:CompanyService,

        private translate: TranslateService,
        private renderer: Renderer2,
        private localizationService: LocalizationService,
            private _router: Router,
            private _notification:NotificationService

  ) { 


    
    const today = new HijriDate();
    const Gorgian2=new Date();
    this.date=this.hijriMonth[today.getMonth()-1]+" "+today.getFullYear()+" | "+
       this.Gorgian[Gorgian2.getMonth()]+" "+Gorgian2.getFullYear()
       //console.log(this.date)
  }
  ngOnInit(){
    this._notification.GetNotification().subscribe(data=>{
      this.Notification=data.Data;
      this.Notification.forEach((item) => {
        if(item.Seen==false)
        {
          this.NotificationLength++;

        }

      })

    })
    this._userService.getProfilePicture().subscribe(response=>{
      this.profileImage=response.Data;
    });
    this._userService.getLoggedStatus().subscribe(response=>{
      this.logged=response;
    })

    if (localStorage.getItem("token")) {
      this.logged=true;
    }
    if (!localStorage.getItem("token")) {
      this.logged=false;
    }
    this.getCompanyDetails();
    
//  if (localStorage.getItem("token")) {
//       this.logged=true;
//     }
//     if (!localStorage.getItem("token")) {
//       this.logged=false;
//     }
//     this.getCompanyDetails();
    
  }
  gotoWith(ID:number,itemLink:string){
 
    this._notification.PostNotification(ID).subscribe(data=>{

      this._notification.GetNotification().subscribe(data=>{

        this.Notification=data.Data;
        this.NotificationLength=0;
        this.Notification.forEach((item) => {
          if(item.Seen==false)
          {
            this.NotificationLength++;
  
          }
  
        })
        this._notification.Count(this.NotificationLength)
        if(itemLink!=""){
        this._router.navigateByUrl(itemLink)
        }

      })

    })
 


  }
  getCompanyDetails() {
    this._companyService.getLoggedCompany().subscribe( response => {
      this.company = response.Data;
      this.name=this.company.UserName;

    } );
}
  signIn() {
    this._router.navigateByUrl("/user/sign-in");
  }
  signOut() {
    this._userService.logout();
    this._router.navigateByUrl("/user/sign-in");
  }
  changeLanguage() {
    this.localizationService.setLanguage(this.localizationService.getLanguage() == 'ar' ? 'en' : 'ar');
    // this.translate.use(this.localizationService.getLanguage());
    window.location.reload();
  }


}
