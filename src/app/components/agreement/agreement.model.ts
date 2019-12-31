import { AgreementStatus } from './agreement-status.enum';

export class AgreementViewModel {
    ID: number = 0;
    RequestID: number = 0;
    NumberOfAuditDays: number;
    NumberOfAuditors: number;
    TechnicalTeamVisitFee: number;
    FixedFees: number;
    TotalRemuneration: number;
    TotalOffer: number;
    SubmissionDate: string;
    CompanyName: string;
    CountryName: string;
    CompayAddress: string;
    CertificateTypeName: string;
    ConsumerSignedAggrementFilePath: string;
    StaffSignedAggrementFilePath: string;
    ConsumerSignedAggrementFileName: string;
    StaffSignedAggrementFileName: string;
    AgreementPDFFilePath:string;
    AgreementPDFFileName:string;
    StaffRequiredAction: number;
    ConsumerRequiredAction: number;
    ConsumerRequiredActionName: string;
    StaffRequiredActionName: string;
    Status: AgreementStatus;
    StatusName: string;
}