import { AlertService } from 'src/app/shared/alert/alert.service';
import { UserService } from './../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html'
})
export class ValidateAccountComponent implements OnInit {

  constructor(
    private _alertService:AlertService,
    private _userService:UserService,private _activatedRoute:ActivatedRoute,private _router:Router) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(params=>{
      if(params.has('code'))
      {
this._userService.validate(params.get('code')).subscribe(response=>{
  if(response.Success)
 {
  this._alertService.success(response.Message);
  //this._router.navigateByUrl("/user/verification-approval");
 }
 else
 {
  this._alertService.error(response.Message);
 }
 this._router.navigateByUrl("/user/sign-in");
  
});
      }
      else{
        this._router.navigateByUrl("/login");
      }
    })
  }


}
