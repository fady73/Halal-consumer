import { Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout-home.component.html',
  // styleUrls: ['./layout.component.css']
})
export class LayoutHomeComponent implements OnInit {
  logged: boolean = false;
  constructor(
    private _userService: UserService,
    private localizationService: LocalizationService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.loadStyles();
    this._userService.getLoggedStatus().subscribe(status => {
      this.logged = status;
    });
    
  }
  signOut() {
    this._userService.logout();
    this._router.navigateByUrl("/user/sign-in");
  }

  loadStyles() {
    let lang: string = this.localizationService.getLanguage();
    if (lang == 'ar') {
      // alert("here to loading en style")
      // require("style-loader!../../../../assets/bootstrap/css/bootstrap.rtl.css");
      // require("style-loader!../../../../assets/css/style-ltr.css");
      // require("style-loader!../../../../assets/css/style-rtl.css");

      // this.loadCss("/assets/css/css//style-en.css")

    } else {
      // alert("here to loading en style")
      // require("style-loader!../../../../assets/bootstrap/css/bootstrap.ltr.css");
      // requires("../../../assets/css/css/style-res.css");
   

      require("style-loader!../../../assets/css/css/style-en.css");
      // this.loadCss("/assets/css/css/style-en.css")
    }
    // this.loadScript("/assets/js/plugins/metisMenu/jquery.metisMenu.js");
    // this.loadScript("/assets/js/app.js");
  }

  public loadScript(url: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);

  }
    public loadCss( url: string ) {
    const node = document.createElement( 'link' );
    node.href = url;
    node.type = 'text/css';
    // node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName( 'head' )[0].appendChild( node );
    // alert("loaded");

  }
}
