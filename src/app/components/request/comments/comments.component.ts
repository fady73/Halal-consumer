import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from '../request.service';
import { RequestCommentViewModel } from '../request-comment.model';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  // styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments:RequestCommentViewModel[]=[];
 @Input() requestID:number=0;
 @Input() stepNumber:number=0;
  constructor(  
     private _requestService: RequestService,
    ) { }

  ngOnInit() {
    
  }
  ngOnChanges(): void {
   
    if(this.requestID>0 && this.stepNumber>0)
    {
      this.getComments(this.requestID);
    }
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  }
  getComments(requestID:number)
  {
    this._requestService.getComments(requestID).subscribe(response=>{
      this.comments=response.Data;
      this.comments=this.comments.filter(x=>x.StepNumber==this.stepNumber);
    });
  }

}
