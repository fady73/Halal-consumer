import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RequestService } from '../request.service';
import { RequestCommentViewModel } from '../request-comment.model';
import { forkJoin } from 'rxjs';
import { RequestViewModel } from '../request.model';

@Component({
  selector: 'sections-steps',
  templateUrl: './sections-steps.component.html',
  styleUrls: ['./sections-steps.component.css']
})

export class SectionsStepsComponent implements OnInit {
 @Input() step=0;
 @Input() requestID=0
 Edit:boolean=false;
 test:Boolean;

 noComments:number[]=[];
 requestStepNumber:number=0;
 comments:RequestCommentViewModel[]=[];
 stepComments:RequestCommentViewModel[]=[];
 request:RequestViewModel=new RequestViewModel();
 first=true;
 type:string;
  constructor(private _requestService:RequestService) { }

  ngOnInit() {

    if (localStorage.getItem("type")) {
      this.type=localStorage.getItem("type");
    }
   
  }
  ngOnChanges(): void {
    
    if(this.requestID>0)
    {
      forkJoin([this._requestService.getRequestStep(this.requestID),
      this._requestService.getRequestPendingComments(this.requestID),
      this._requestService.getByID(this.requestID),
      this._requestService.getEditableSections(this.requestID)

      ])
      .subscribe(response=>{
        this.requestStepNumber=response[0].Data as number;
        //alert(this.requestStepNumber);
        this.comments=response[1].Data as RequestCommentViewModel[];
        this.noComments=response[3].Data;

      if(this.comments && this.comments.length>0)
      {
        this.first=false;

        this.stepComments=this.comments.filter(x=>x.StepNumber==this.step);

      }
      
        this.request=response[2].Data ;
      });
      
    }
    
    
  }
  stepHasComments(step:number):boolean{
   return this.noComments.filter(comment=>comment==step).length>0;
  }
  canNavigateToStep(stepNumber:number):boolean
  {
    return this.requestStepNumber>=stepNumber;
  }
}
