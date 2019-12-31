import { Router } from '@angular/router';
import { UserService } from './../../user/user.service';
import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Component( {
  
  selector: 'app-footer',
  templateUrl: './footer.component.html',
} )
export class FooterComponent implements OnInit {
  logged: boolean = false;
  constructor(
    private _userService: UserService,
    private localizationService: LocalizationService,
    private _router: Router
  ) { }
  ngOnInit() {
    
    if (localStorage.getItem("token")) {
      this.logged=true;
    }
    if (!localStorage.getItem("token")) {
      this.logged=false;
    }
  }

}
