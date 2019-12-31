import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RegularRequestCreateViewModel } from '../regular-request/regular-request-create.model';
import { AppendixPrimarySectorService } from './appendix-primary-sector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegularRequestService } from '../regular-request.service';
import { Patterns } from 'src/app/shared/common/patterns';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-appendix-primary-sector',
  templateUrl: './appendix-primary-sector.component.html',
  // styleUrls: ['./appendix-primary-sector.component.css']
})
export class AppendixPrimarySectorComponent implements OnInit {

  
  formCattleBreeding:FormGroup;
  formPoultry:FormGroup;
  formVegetables:FormGroup;
  isEditable=false;
  model:RegularRequestCreateViewModel=new RegularRequestCreateViewModel();
  isPageLoaded:boolean=false;
  //items:ProductCategoryViewModel[]=[];
  //selectedCategories:RequestAppendixIViewModel[]=[];
  constructor(
    private _formBuilder:FormBuilder,
    private _activatedRoute:ActivatedRoute,
    private _router:Router,
    private _requestService:RequestService,
     private _regularRequestService:RegularRequestService,
     private _appendixPrimarySectorService:AppendixPrimarySectorService) { }

  ngOnInit() {
this.initializePage();
   
  }
  initializePage() {

    this._activatedRoute.paramMap.subscribe(params => {
      this.model.RequestID = +params.get('id');
      //alert(this.model.RequestID);
      forkJoin([
        this._regularRequestService.getEditableByID(this.model.RequestID),
        this._requestService.getIsEditableSection(this.model.RequestID,8)

        //this._appendixClassificationService.getAppendixI(this.id)

      ]).subscribe(res=>{
        this.model=res[0].Data;
        this.isEditable=res[1].Data;

        if(!this.model)
        this.model=new RegularRequestCreateViewModel();
        this.model.RequestID = +params.get('id');
        this.createCattleBreedingFrom();
        this.createPoultryFrom();
        this.createVegetablesFrom();
        this.isPageLoaded=true;
      });
    });
  }
  resetForm() {
    this._router.navigateByUrl(`/request/appendix-classification/${this.model.RequestID}`);
  }
  post(){
    //alert(this.model.RequestID);
    
    if(this.formVegetables.valid)
    {
    let vegetable=this.formVegetables.value;
      this.model.VegetablesProducers.push(vegetable);

    }
    this.model.VegetablesProducers.forEach(x=>{
      x.RegularRequestID=this.model.RequestID;
    });
    if(this.formCattleBreeding.valid)
    {
    let cattleBreeding=this.formCattleBreeding.value;
    this.model.CattleBreedings.push(cattleBreeding);
    }

    this.model.CattleBreedings.forEach(item=>{
      item.RegularRequestID=this.model.RequestID;
    });
   if(this.formPoultry.valid){
    let poultry=this.formPoultry.value;
      this.model.Poultries.push(poultry);
   }
    this.model.Poultries.forEach(item=>{
      item.RegularRequestID=this.model.RequestID
    });

    // alert(JSON.stringify(this.model.VegetablesProducers))
    // alert(JSON.stringify(this.model.Poultries))
    // alert(JSON.stringify(this.model.CattleBreedings))

   this._appendixPrimarySectorService.post(this.model).subscribe(response=>{

    this._router.navigateByUrl(`/request`)

    //  alert(response.Success);
    //  alert(response.Message);
   });
    
  }



  removeformPoultry( familyIndex: number ) {
    // if ( this.model.VegetablesProducers.length == 0 ) {
      this.model.Poultries.splice( familyIndex, 1 );
    // }
  }
  removeLastformPoultry() {

    this.formPoultry.reset();


  }
  removeCattleBreedings( familyIndex: number ) {
    // if ( this.model.VegetablesProducers.length == 0 ) {
      this.model.CattleBreedings.splice( familyIndex, 1 );
    // }
  }
  removeLastCattleBreedings() {

    this.formCattleBreeding.reset();


  }


  removeVegetablesProducers( familyIndex: number ) {
    // if ( this.model.VegetablesProducers.length == 0 ) {
      this.model.VegetablesProducers.splice( familyIndex, 1 );
    // }
  }
  removeLastVegetablesProducers() {

    this.formVegetables.reset();


  }
  createCattleBreedingFrom(){
    this.formCattleBreeding=this._formBuilder.group({
      CattleType:['',[Validators.required]],
      NumberOfProcedures:[0,[Validators.required,Validators.pattern(Patterns.OnlyNumbers),Validators.min( 0 )]],
      Activity:['',[Validators.required]],
      NumberOfAnimals:[0,[Validators.required,Validators.pattern(Patterns.OnlyNumbers),Validators.min( 0 )]]
    });
  }
  addCattleBreeding(){
    if(this.formCattleBreeding.valid)
    {
      let cattleBreeding=this.formCattleBreeding.value;
      this.model.CattleBreedings.push(cattleBreeding);
      this.formCattleBreeding.reset();
      // this.formCattleBreeding.patchValue({

      // });
    }
    
  }
  
  createVegetablesFrom(){
    this.formVegetables=this._formBuilder.group({
      VegetableType:['',[Validators.required]],
      NumberOfProcedures:[0,[Validators.required,Validators.pattern(Patterns.OnlyNumbers),Validators.min( 0 )]],
      Activity:['',[Validators.required]],
      Surface:['',[Validators.required]]
    });
  }
  addVegetable(){
    if(this.formVegetables.valid)
    {
      let vegetable=this.formVegetables.value;
      this.model.VegetablesProducers.push(vegetable);
      this.formVegetables.reset();
      // this.formCattleBreeding.patchValue({

      // });
    }
    
  }
  
  createPoultryFrom(){
    this.formPoultry=this._formBuilder.group({
      // CattleType:['',[Validators.required]],
      NumberOfHouse:[0,[Validators.required,Validators.pattern(Patterns.OnlyNumbers),Validators.min( 0 )]],
      Activity:['',[Validators.required]],
      // AnimalsCounts:[1,[Validators.required,Validators.pattern(Patterns.OnlyNumbers)]]
    });
  }
  addPoultry(){
    if(this.formPoultry.valid)
    {
      let poultry=this.formPoultry.value;
      this.model.Poultries.push(poultry);
      this.formPoultry.reset();
      // this.formCattleBreeding.patchValue({

      // });
    }
    
  }
}

