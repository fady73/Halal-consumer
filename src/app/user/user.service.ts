import { Subject } from 'rxjs';
import { TokenService } from './../shared/services/token.service';
import { ApiService } from './../shared/services/api.service';
import { ConsumerCreateModel } from './sign-up/consumer-create-model';
import { Injectable } from '@angular/core';
import { CrudService } from '../shared/services/crud.service';
import { ProfilePictureViewModel } from '../components/company/profile/change-profile-picture';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 controller="company"
 logged=new Subject<boolean>();
  constructor(private _apiService:ApiService
    ,private _tokenService:TokenService,
    ) {
      this.changeLoggedStatus(true);
      //alert(this._tokenService.hasAccessToken());
     // this.changeLoggedStatus(this._tokenService.hasAccessToken());
     }
 
     login(token:string)
     {
       this._tokenService.setToken(token);
       this.changeLoggedStatus(true);
     }
     logout()
     {
       this._tokenService.removeToken();
       this.changeLoggedStatus(false);
     }
  changeLoggedStatus(status:boolean)
  {
    this.logged.next(status);
  }
  getLoggedStatus()
  {
    return this.logged.asObservable();
    //return this.logged.asObservable();
  }
  getProfilePicture( )
  {
    return this._apiService.get(`/${this.controller}/GetProfilePicture`);
  }
  changeProfilePicture(viewModel:ProfilePictureViewModel )
  {
    return this._apiService.post(`/${this.controller}/ChangeProfilePicture`,viewModel);
  }
  signup(viewModel:ConsumerCreateModel )
  {
    return this._apiService.post(`/${this.controller}/post`,viewModel);
  }
  validate(code:string)
  {
    return this._apiService.post(`/${this.controller}/validate`,{Code:code});
  }
  sendVerificationRequest()
  {
    return this._apiService.post(`/${this.controller}/SendVerificationRequest`);
  }



}
