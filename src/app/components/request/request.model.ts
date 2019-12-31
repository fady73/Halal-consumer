import { ConsumerRequiredAction } from './consumer-required-action.enum';
import { StaffRequiredAction } from './staff-required-action.enum';

export class RequestViewModel {
    ID: number;
    CompanyID: number;
    CompanyName: string;
    CompanyAddress: string;
    InvoiceAddress: string;
    SameAddress: boolean;
    TradelicenseNumber: string;
    IsPartGroup: boolean;
    GroupName: string;
    CompanyCountry: string;
    CompanyTypeName: string;
    AssignedEmployee: string;
    AssignedEmployeeID: number;
    ManagmentRepresentative: string;
    Position: string;
    FoodSafetyManager: string;
    TelephoneNumber: string;
    Email: string;
    ApplicationDate: string;
    StepNumber: number;
    Status: number;
    StatusName: string;
    ConsumerRequiredAction = ConsumerRequiredAction.None;
    ConsumerRequiredActionName = "";
    StaffRequiredAction = StaffRequiredAction.None;
    StaffRequiredActionName = "";
    CertificateFilePath: string;
    IsActive: boolean;
    IsSelected: boolean = false;
    note:string="";
    RequestCancellationStatus:number;
    IsRenewable:boolean;

}
