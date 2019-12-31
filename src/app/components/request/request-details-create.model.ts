import { ConsumerViewModel } from './../consumer/consumer-model';
export class RequestDetailsCreateViewModel {
    ID: number=0;
    Name: string;
    InvoiceAddress: string;
    SameAddress:boolean=false;
    TradeLicenseNumber: number;
    FoodSafetyManager: string;
    GroupName: string;
    IsPartGroup:boolean=false;
    PhoneNumber: string;
    Email: string;
    Status: string;
    ManagmentRepresentative:string;
    Position:string;
    PostalCode:string;

    //Consumer:ConsumerViewModel=new  ConsumerViewModel();
    IsActive: boolean;
    IsSelected: boolean = false;
}