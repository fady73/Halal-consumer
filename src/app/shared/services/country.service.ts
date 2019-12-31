import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class CountryService {
    controller="country";
    constructor(private _apiService:ApiService) { }
    getList(){
return this._apiService.get(`/${this.controller}/getList`);
    }
}