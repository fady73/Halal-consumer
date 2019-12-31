import { AttachmentCreateViewModel } from './../../../shared/view-models/attachment-create.model';
export class NCRNCSCreateViewModel {
    ID: number;
    NCRID: number;
    Date: Date = new Date();
    StandardClause: string;
    Description: string;
    Analysis: string;
    AssessorID: number;
    CABAcceptance: boolean = false;
    CorrectiveAction: string;
    SuppliedDocuments: AttachmentCreateViewModel[] = [];
    ImplementationPeriod: Date = new Date();
}