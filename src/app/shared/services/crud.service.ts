import { UserService } from './../../user/user.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { DateService } from './date.service';
import { AlertService } from '../alert/alert.service';

@Injectable( {
  providedIn: 'root'
} )
export class CrudService {

  constructor( public alert: AlertService,
    public userService: UserService,
    public modalService: BsModalService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public dateService: DateService
  ) { }
}
