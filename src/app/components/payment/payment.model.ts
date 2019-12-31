import { PaymentStatus } from './payment-status.enum';

export class PaymentViewModel {
    ID: number = 0;
    RequestID: number = 0
    NumberOfAuditDays: number;
    NumberOfAuditors: number;
    TechnicalTeamVisitFee: number;
    FixedFees: number;
    TotalRemuneration: number;
    TotalOffer: number;
    SubmissionDate:string;
    CompanyName:string;
    CountryName:string;
    CompayAddress:string;
    Date:Date;
    CertificateTypeName:string;
    RequestType:string;
    ConsumerSignedAggrementFilePath:string;
    StaffSignedAggrementFilePath:string;
    ConsumerSignedAggrementFileName:string;
    StaffSignedAggrementFileName:string;
    Status:PaymentStatus;
    StatusName:string;
}