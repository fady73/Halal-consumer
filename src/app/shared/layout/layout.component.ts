import { Component, OnInit, Renderer2 } from '@angular/core';
import { LocalizationService } from '../services/localization.service';


@Component( {
  selector: 'app-layout',
  templateUrl: './layout.component.html',
} )
export class LayoutComponent implements OnInit {

  constructor(
    private localizationService: LocalizationService
  ) { }

  ngOnInit() {
    this.loadStyles();
  }
  loadStyles() {
    let lang: string = this.localizationService.getLanguage();
    if (lang == 'ar') {
      // alert("here to loading en style")
      // require("style-loader!../../../../assets/bootstrap/css/bootstrap.rtl.css");
      // require("style-loader!../../../../assets/css/style-ltr.css");
      // require("style-loader!../../../../assets/css/style-rtl.css");
      // debugger;
      // alert("done")
      // require("style-loader!../../../assets/css/css/style-en.css");
      // // this.loadCss("/assets/css/css//style-en.css")

    } else {
      // alert("here to loading en style")
      // require("style-loader!../../../../assets/bootstrap/css/bootstrap.ltr.css");
      // requires("../../../assets/css/css/style-res.css");
      // debugger;
      // alert("done")

      require("style-loader!../../../assets/css/css/style-en.css");
      // this.loadCss("/assets/css/css/style-en.css")
    }
    // this.loadScript("/assets/js/plugins/metisMenu/jquery.metisMenu.js");
    // this.loadScript("/assets/js/app.js");
  }

}
