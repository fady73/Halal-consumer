import { AuditPlanStatus } from './audit-plan-status.enum';

export class AuditPlanViewModel {
    ID: number;
    RequestID:number;
    Status: AuditPlanStatus;
    AuditPlanPDFFilePath: string = "";
    NCRFilePath: string = "";
    CorrectivePlanFilePath: string = "";
}