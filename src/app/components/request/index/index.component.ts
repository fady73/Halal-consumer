import { AttachmentCreateViewModel } from 'src/app/shared/view-models/attachment-create.model';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { UploadFile } from 'src/app/shared/view-models/upload-file';
import { AlertService } from './../../../shared/alert/alert.service';
import { Page } from './../../../shared/view-models/page.model';
import { CrudService } from 'src/app/shared/services/crud.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { RequestViewModel } from '../request.model';
import { RequestSearchViewModel } from '../request-search.model';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'src/app/shared/view-models/select-view-model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RequestService } from '../request.service';
import { RequestCancelViewModel } from '../request-cancel.model';
import { NotificationService } from 'src/app/shared/layout/notification.service';
import { Notification } from '../../../shared/layout/notification'
import { NotePayment } from '../../../shared/layout/notification'
import { Router } from '@angular/router';
import { CommissionCreateViewModel } from '../commission-create.model';
import { FinalActionReasonViewModel } from '../final-action-reason-model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  page: Page = new Page();
  Notifications: Notification[] = [];
  Notes: NotePayment[] = [];
  AgreementNotes: NotePayment[] = [];
  CommissionModel: CommissionCreateViewModel = new CommissionCreateViewModel();
  searchViewModel: RequestSearchViewModel = new RequestSearchViewModel();
  items: RequestViewModel[] = [];
  countries: SelectItem[] = [];
  requestTypes: SelectItem[] = [];
  requestStatus: SelectItem[] = [];
  companies: SelectItem[] = [];
  requestCancelViewModel: RequestCancelViewModel = new RequestCancelViewModel();
  selectedItem: RequestViewModel = new RequestViewModel();
  modalRef: BsModalRef;
  isReasonLoaded = false;
  finalActionReasonModel: FinalActionReasonViewModel = new FinalActionReasonViewModel();
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: any;
  @ViewChild('fileInput', { static: false }) myInputVariable: ElementRef;
  @ViewChild('commissionTemplate', { static: false }) commissionTemplate: any;
  @ViewChild('finalActionReasonReasonTemplate', { static: false }) finalActionReasonReasonTemplate: any;

  type: string;

  constructor(
    private _notification: NotificationService,
    private _formBuilder: FormBuilder,
    private requestService: RequestService,
    // private modalService:BsModalService,
    private _attachmentService: AttachmentService,
    private _router: Router,
    private crud: CrudService,
    private alertService: AlertService
  ) {

  }

  ngOnInit() {
    if (localStorage.getItem("type")) {
      this.type = localStorage.getItem("type");
    }
    if (this.type == '0') {
      this.page.columns = [
        { Name: "ID", Title: "request.all-requests.id", Selectable: true, Sortable: true },
        { Name: "ApplicationDate", Title: "request.all-requests.date", Selectable: true, Sortable: true },
        // { Name: "CompanyCountry", Title: "request.all-requests.company-country", Selectable: true, Sortable: true },
        { Name: "CompanyTypeName", Title: "request.all-requests.type", Selectable: true, Sortable: true },
        { Name: "StatusName", Title: "request.all-requests.status", Selectable: true, Sortable: true },
        // { Name: "View", Title: "shared.view", Selectable: true, Sortable: true },
        { Name: "Action", Title: "shared.action", Selectable: true, Sortable: true },
        { Name: "Available actions", Title: "shared.available", Selectable: true, Sortable: true },

        { Name: "Cancel", Title: "shared.cancel", Selectable: true, Sortable: true },
      ];
    }
    else {
      this.page.columns = [
        { Name: "ID", Title: "request.all-requests.id", Selectable: true, Sortable: true },
        { Name: "ApplicationDate", Title: "request.all-requests.date", Selectable: true, Sortable: true },
        // { Name: "CompanyCountry", Title: "request.all-requests.company-country", Selectable: true, Sortable: true },
        { Name: "CompanyTypeName", Title: "request.all-requests.type", Selectable: true, Sortable: true },
        { Name: "StatusName", Title: "request.all-requests.status", Selectable: true, Sortable: true },
        { Name: "Action", Title: "shared.action", Selectable: true, Sortable: true },
        { Name: "Action2", Title: "shared.available", Selectable: true, Sortable: false },
        { Name: "Cancel", Title: "shared.cancel", Selectable: true, Sortable: true },
      ];
    }
    // this.initializePage();
    // this.createSearchForm();
    this.search();
    this._notification.GetNotification().subscribe(data => {
      this.Notifications = data.Data;
      this.Notifications.forEach((item) => {
        if (item.Type == 9 && !item.Seen) {

          this.Notes.push(item)
        }
        if (item.Type == 20 && !item.Seen) {
          this.AgreementNotes.push(item)
        }
      })


    })

    console.log(JSON.stringify(this.items))

  }
  createSearchForm() {
    this.searchViewModel.ToDate = new Date();
    this.searchViewModel.FromDate.setDate((new Date()).getDate() - 30);
    this.page.seachForm = this._formBuilder.group({
      ID: [this.searchViewModel.ID],
      CountryID: [this.searchViewModel.CountryID],
      FromDate: [moment(this.searchViewModel.FromDate).format('MM-DD-YYYY')],
      ToDate: [moment(this.searchViewModel.ToDate).format('MM-DD-YYYY')],
      CompanyID: [this.searchViewModel.CompanyID],
      StatusID: [this.searchViewModel.StatusID],
      TypeID: [this.searchViewModel.TypeID],

      NID: [this.searchViewModel.NID]
    });
  }
  initializePage() {
    forkJoin([
      this.requestService.getRequestTypeList(),
      this.requestService.getCompaniesList(),
      this.requestService.getRequestStatusList(),
      this.requestService.getCountriesList()
    ]).subscribe(res => {
      this.requestTypes = res[0].Data;
      this.companies = res[1].Data;
      this.requestStatus = res[2].Data;
      this.countries = res[3].Data;
      this.createSearchForm();
      this.search();
    }, error => { }, () => {
      this.page.isPageLoaded = true;

    });
  };
  onSearchClicked() {
    this.items = [];
    Object.assign(this.searchViewModel, this.page.seachForm.value);
    this.search();
  }
  search(orderBy: string = "ID", isAscending: boolean = false, pageIndex: number = 1) {
    this.page.isLoading = true;
    //Object.assign( this.searchViewModel, this.page.seachForm.value );
    this.requestService.get(this.searchViewModel, orderBy, isAscending, pageIndex).subscribe(response => {
      if (response.Success) {

        this.page.options.totalItems = response.Data.Records;
        this.page.options.totalPages = response.Data.Pages;
        this.items = response.Data.Result as RequestViewModel[];
        console.log(this.items)

        this.page.isLoading = false;
      }

    }, null, () => {
      this.page.selectedAll = false;
      this.page.isPageLoaded = true;
    });
  }
  OnSearchClicked() {
    this.page.options.currentPage = 1;
    this.search("ID", this.page.isAscending, 1);
  }
  OnSortClicked(name) {
    this.page.options.currentPage = 1;

    if (name === this.page.orderBy) {
      this.page.isAscending = !this.page.isAscending;
    }
    else {
      this.page.isAscending = true;
    }
    this.page.orderBy = name;
    this.search(this.page.orderBy, this.page.isAscending, 1);
  }
  getNextPrevData(pageIndex) {
    this.search(this.page.orderBy, this.page.isAscending, pageIndex);
    this.page.options.currentPage = pageIndex;
  }

  isColumnSelected(column: string): number {
    return (column != this.page.orderBy) ? 0 : (this.page.isAscending ? 1 : 2);
  }

  cancel(item) {

    let index = this.items.indexOf(item);
    // this.items[index].Status = 4;
    this.items[index].RequestCancellationStatus = 1;
    // this.items[index].StatusName = "Canceled";

    this.requestCancelViewModel.RequestID = this.items[index].ID;
    //  console.log(JSON.stringify(this.requestCancelViewModel))
    this.requestService.cancel(this.requestCancelViewModel).subscribe(response => {
      let pageIndex: number = this.page.options.currentPage;
      // if ( this.items.length == 0 ) {
      //   pageIndex = pageIndex > 1 ? --pageIndex : 1;
      // }
      this._router.navigateByUrl(`/request`);

      this.alertService.success(response.Message);
    },
      error => {
        // this.items.splice( index, 0, item );
        // this.items[index].Status = 0;
        // this.items[index].StatusName = "New";
        this.alertService.error("An error occur , Please try again later    ")
      },
      () => { }

    );
  }

  renewRequest(id: number) {
    this.requestService.renew(id).subscribe(response => {
      let requestID = response.Data;
      this.crud.router.navigateByUrl(`/request/edit/${requestID}`, { state: { type: 'renew' } });
    })
  }
  remove(item: RequestViewModel) {
    let index = this.items.indexOf(item);
    this.items.splice(index, 1);
    this.requestService.remove(item.ID).subscribe(response => {
      let pageIndex: number = this.page.options.currentPage;
      if (this.items.length == 0) {
        pageIndex = pageIndex > 1 ? --pageIndex : 1;
      }
      this.alertService.success(response.Message);
    },
      error => {
        this.items.splice(index, 0, item);
        this.alertService.error("حدث خطأ اثناء عملية الحذف")
      },
      () => { }

    );
  }




  showCancelConfirmation(selectedItem: RequestViewModel) {
    this.selectedItem = selectedItem;
    if (this.selectedItem.RequestCancellationStatus == 1 || this.selectedItem.RequestCancellationStatus == 2) {

    }
    else {
      this.modalRef = this.crud.modalService.show(this.cancelTemplate, { class: 'modal-md' });
    }
  }


  showCommissionTemplate(selectedItem: RequestViewModel) {
    this.CommissionModel = new CommissionCreateViewModel();
    this.selectedItem = selectedItem;
    this.modalRef = this.crud.modalService.show(this.commissionTemplate, { class: 'modal-md' });
  }
  showFinalActionReason(selectedItem: RequestViewModel) {
    this.finalActionReasonModel = new FinalActionReasonViewModel();
    this.isReasonLoaded = false;
    if (selectedItem.Status == 20) {
      this.requestService.getWithdrawlReason(selectedItem.ID).subscribe(response => {
        this.isReasonLoaded = true;
        this.finalActionReasonModel = response.Data;
        console.log(this.finalActionReasonModel)
      });
    }

    if (selectedItem.Status == 21) {
      this.requestService.getSuspensionReason(selectedItem.ID).subscribe(response => {
        this.isReasonLoaded = true;
        this.finalActionReasonModel = response.Data;
        console.log(this.finalActionReasonModel)
      });
    }

    if (selectedItem.Status == 4) {
      this.requestService.getCancelationReason(selectedItem.ID).subscribe(response => {
        this.isReasonLoaded = true;
        this.finalActionReasonModel = response.Data;
        console.log(this.finalActionReasonModel)
      });
    }
    this.modalRef = this.crud.modalService.show(this.finalActionReasonReasonTemplate, { class: 'modal-md' });

  }

  uploadCommissionFiles(event) {
    console.log(event);
    let isAllawableExt = true;
    let isBiggerThan5MB = false;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let formData: FormData = new FormData();
      for (let index = 0; index < fileList.length; index++) {
        let file: File = fileList[index];
        var ext = file.name.split('.')[1];
        if (ext != "pdf" && ext != "docx" && ext != "doc") {
          isAllawableExt = false;
        }
        else if ((file.size / 1024 / 1024) > 5) {
          isBiggerThan5MB = true;
        }
        else {
          formData.append('uploadFile_' + index, file, file.name);
        }
      }
      if (isAllawableExt == false) {
        this.crud.alert.error("Only allawable files are pdf , doc , docx");
        this.myInputVariable.nativeElement.value = "";

      }
      else if (isBiggerThan5MB == true) {
        this.crud.alert.error("Maximum file size is 5 MB");
        this.myInputVariable.nativeElement.value = "";
      }
      else {
        this._attachmentService.upload(formData).subscribe(response => {
          if (response.Success) {
            let files: UploadFile[] = response.Data;
            for (let index = 0; index < files.length; index++) {
              let item = files[index];
              let attachment = new AttachmentCreateViewModel();
              attachment.FilePath = item.FilePath;
              attachment.FileName = item.FileName;
              attachment.FileName = item.FileName;
              if (!this.CommissionModel.Attachments)
                this.CommissionModel.Attachments = [];
              this.CommissionModel.Attachments.push(attachment);
            }
            this.myInputVariable.nativeElement.value = "";
          }
        }, null, () => { });
      }

    }
    else {
    }
  }
  removeCommissionAttachment(index: number) {
    this.CommissionModel.Attachments.splice(index, 1);
  }

  saveCommisions() {
    console.log(JSON.stringify(this.CommissionModel));
    this.CommissionModel.RequestID = this.selectedItem.ID;
    this.requestService.POSTCommission(this.CommissionModel).subscribe(response => {
      console.log(response);
      if (response.Success) {
        this.crud.alert.success(response.Message);
      }
      this.search(this.page.orderBy, this.page.isAscending, this.page.options.currentPage);
    });
  }
  selectAll() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].IsSelected = this.page.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.page.selectedAll = this.items.every(function (item: any) {
      return item.selected == true;
    })
  }
}
