import { Component, OnInit,HostBinding,Input, HostListener } from '@angular/core';
import { NotificationService } from '../../../shared/layout/notification.service';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import {Notification} from '../../../shared/layout/notification'
@Component({
  selector: 'app-show-notification',
  templateUrl: './show-notification.component.html',
  styleUrls: ['./show-notification.component.css']
})
export class ShowNotificationComponent implements OnInit {
  Notifications:Notification[]=[];
  pageIndex: number = 1;
  notify:number=0;
  pageSize: number = 10;
  spinner: any;
  p: number = 1;
  NotificationLength:number=0;
 
  
  constructor(private _notification:NotificationService,
    private _crudService: CrudService,
    //private _branchService: BranchService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    
    private route:Router) { }
   

  ngOnInit() {
    this._notification.GetNotification().subscribe(data=>{
      this.Notifications=data.Data;
      this.notify=this.Notifications.length;
      this.Notifications.forEach((item) => {
        if(item.Seen==false)
        {
          this.NotificationLength++;

        }

      })
      this.notify= this.notify-this.NotificationLength

    })
  
   

    

  }
  
  gotoWith(ID:number,itemLink:string){
 
    this._notification.PostNotification(ID).subscribe(data=>{
      
      this._notification.GetNotification().subscribe(data=>{

        this.Notifications=data.Data;
        this.NotificationLength=0;
        this.Notifications.forEach((item) => {
          if(item.Seen==false)
          {
            this.NotificationLength++;
  
          }
  
        })
        this._notification.Count(this.NotificationLength)
        this.route.navigateByUrl(itemLink)

      })

    })
 


  }
  
  goto(ID:number){
 
    this._notification.PostNotification(ID).subscribe(data=>{
      
      this._notification.GetNotification().subscribe(data=>{

        this.Notifications=data.Data;
        this.NotificationLength=0;
        this.Notifications.forEach((item) => {
          if(item.Seen==false)
          {
            this.NotificationLength++;
  
          }
  
        })
        this._notification.Count(this.NotificationLength)

      })

    })
  }
  

}
