import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { ApiService } from './api.service';


@Injectable( {
  providedIn: 'root'
} )
export class EmployeeService {

  controller: string = "Employee";
  constructor( private apiService: ApiService ) { }

  getList( branchID: number = 1 ) {
    return this.apiService.get( `/${this.controller}/GetList?branchID=${branchID}` )
  }

  deleteAllSelected( body: number[] ) {
    return this.apiService.post( `/${this.controller}/RemoveAllSelected`, body );

  }
  postEntry( body ) {
    return this.apiService.update( `/entry/Put`, body )
  }
  removeAll( IDs: number[] ) {
    return this.apiService.post( `/${this.controller}/RemoveAllSelected`, IDs );
  }

  remove( Id: number ) {
    return this.apiService.remove( `/${this.controller}/delete/${Id}` );
  }
  getEmployeeAccountsWithBalance( id: number ) {
    return this.apiService.get( `/${this.controller}/GetEmployeeAccountsWithBalance/${id}` );
  }

}
