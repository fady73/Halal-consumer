import { Component, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizationService } from './shared/services/localization.service';
import { AlertService } from './shared/alert/alert.service';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
} )
export class AppComponent implements OnInit {

  title = 'halal-consumer';
  progressbarDirection = 'rtl+';
  spinnerPosition = "left";
  constructor( private renderer: Renderer2, private localizationService: LocalizationService, private router: Router,private _alertService:AlertService) {
    this.localizationService.setLanguage( this.localizationService.getLanguage() );
  
    this._alertService.error("Sorry an error occurred. please try again");

  }

  ngOnInit() {
    this.loadStyles();
  }
  loadStyles() {
    this.loadScript( "/assets/js/js/script.js" );
  }
  public loadScript( url: string ) {
    let node = document.createElement( 'script' );
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName( 'head' )[0].appendChild( node );
    //alert("loaded");

  }
}
